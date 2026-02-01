import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable pour le formulaire
import { OrderService } from '../../services/order-service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajout de FormsModule
  templateUrl: './order-component.html',
  styleUrl: './order-component.css'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  showForm = signal(false); // Pour afficher/masquer le formulaire

  // Modèle pour le nouveau formulaire
  newOrder = {
    userId: 1, // Utilisateur par défaut pour le test
    items: [{ productId: null, quantity: null, price: null }]
  };

  ngOnInit(): void {
    this.loadOrders();
  }

  // --- Logique du formulaire ---

  addItem() {
    this.newOrder.items.push({ productId: null, quantity: null, price: null });
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }

onSubmit() {
  const orderData: any = {
    orderDate: new Date(),
    status: 'PENDING',
    user: { id: Number(this.newOrder.userId) }, // Assurez-vous que c'est un nombre
    // Utiliser "items" et non "orderItems"
    items: this.newOrder.items.map(item => ({
      product: { id: item.productId }, // Souvent le backend attend un objet Product
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: this.newOrder.items.reduce((acc, item) =>
      acc + (item.price !== null ? item.price * (item.quantity ?? 0) : 0), 0)
  };

  console.log("Données envoyées :", orderData); // Vérifiez la console avant l'erreur

  this.orderService.createOrder(orderData).subscribe({
    next: (res) => {
      this.orders.update(prev => [res, ...prev]);
      this.showForm.set(false);
      this.resetForm();
    },
    error: (err) => {
      console.error(err); // Affiche l'erreur réelle du serveur
      alert("Erreur lors de la création : " + (err.error?.message || "Vérifiez les données"));
    }
  });
}

  resetForm() {
   this.newOrder = { userId: 1, items: [{ productId: null, quantity: null, price: null }] };
  }

  // --- Méthodes existantes ---
  loadOrders() {
    this.orderService.getUserOrders(1).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
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
