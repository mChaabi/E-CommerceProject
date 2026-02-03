import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable pour le formulaire
import { OrderService } from '../../services/order-service';
import { Order } from '../../models/order';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  // 2. Injectez votre ProductService (assurez-vous d'avoir ce service)
  private productService = inject(ProductService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  showForm = signal(false); // Pour afficher/masquer le formulaire
  // 1. Ajoutez une propriété pour stocker les produits
  allProducts = signal<any[]>([]);

  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 10;

  // Modèle pour le nouveau formulaire
  newOrder = {
    userId: 1, // Utilisateur par défaut pour le test
    paymentMethod: 'CASH', // Valeur par défaut
    downPayment: 0,        // Montant du 3arbon
    items: [{ productId: null, quantity: null, price: null }]
  };

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts(); // Chargez les produits au démarrage
  }

loadProducts() {
  this.productService.getAllProducts().subscribe({
    next: (products) => this.allProducts.set(products),
    error: (err) => console.error("Erreur produits", err)
  });
}

// 3. (Optionnel) Mettre à jour le prix automatiquement quand on choisit un produit
onProductChange(item: any) {
  const selected = this.allProducts().find(p => p.id === Number(item.productId));
  if (selected) {
    item.price = selected.price; // Remplit automatiquement le prix unitaire
  }
}

  // --- Logique du formulaire ---

  addItem() {
    this.newOrder.items.push({ productId: null, quantity: null, price: null });
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }
  onSubmit() {
    // 1. Validation de sécurité
    const hasInvalidItem = this.newOrder.items.some(item => !item.productId || !item.quantity);
    if (hasInvalidItem) {
      alert("Veuillez sélectionner un produit et une quantité pour chaque ligne.");
      return;
    }

    const orderData = {
      orderDate: new Date(), // Requis par l'interface Order
      status: 'PENDING',
      paymentMethod: this.newOrder.paymentMethod,
      downPayment: this.newOrder.downPayment,

      // Pour le backend (userId direct)
      userId: Number(this.newOrder.userId),

      // Pour l'interface Frontend (objet user) - Optionnel selon votre modèle
      user: { id: Number(this.newOrder.userId) },

      // Mapping des items pour correspondre au OrderItemDTO du backend
      items: this.newOrder.items.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        price: Number(item.price)
      })),

      totalAmount: this.newOrder.items.reduce((acc, item) =>
        acc + (item.price !== null ? item.price * (item.quantity ?? 0) : 0), 0)
    };

    console.log("JSON envoyé :", orderData);

    // 3. Appel au service (on force le type si nécessaire pour ignorer l'erreur de soulignement)
    this.orderService.createOrder(orderData as any).subscribe({
      next: (res) => {
        this.orders.update(prev => [res, ...prev]);
        this.showForm.set(false);
        this.resetForm();
      },
      error: (err) => {
        console.error("Erreur détaillée :", err);
        // Si l'erreur 404 persiste, vérifiez l'URL dans OrderService (enlevez le /api si besoin)
        alert("Erreur : " + (err.error?.message || "Vérifiez la console ou l'URL du serveur"));
      }
    });
  }

  // 3. N'oublie pas de mettre à jour resetForm()
  resetForm() {
    this.newOrder = {
      userId: 1,
      paymentMethod: 'CASH',
      downPayment: 0,
      items: [{ productId: null, quantity: null, price: null }]
    };
  }

  // AJOUTER CETTE MÉTHODE pour le bouton voir/imprimer
  onViewInvoice(orderId: number | undefined) {
    if (orderId) {
      this.router.navigate(['/orders/invoice', orderId]);
    }
  }
  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getUserOrders(1, this.currentPage(), this.pageSize).subscribe({
      next: (data: any) => {
        console.log("Données reçues :", data);

        if (data && Array.isArray(data)) {
          // CASO A: El backend devuelve una lista simple []
          this.orders.set(data);
          this.totalPages.set(1); // No hay paginación real
        } else if (data && data.content) {
          // CASO B: El backend devuelve un objeto Page { content: [], totalPages: x }
          this.orders.set(data.content);
          this.totalPages.set(data.totalPages);
        } else {
          console.warn("Format inconnu", data);
          this.orders.set([]);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Erreur de connexion :", err);
        this.isLoading.set(false);
      }
    });
  }
  // Méthode pour changer de page
  changePage(delta: number) {
    const newPage = this.currentPage() + delta;
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.loadOrders();
    }
  }

  goToPage(page: number) {
    // Sécurité pour ne pas sortir des limites
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrders();
    }
  }
  changeStatus(orderId: number | undefined, newStatus: string) {
    if (!orderId) return;
    this.orderService.updateStatus(orderId, newStatus).subscribe(() => {
      this.orders.update(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    });
  }

  onDelete(id: number | undefined) {
    if (id && confirm('Supprimer ?')) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.orders.update(prev => prev.filter(o => o.id !== id));
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
