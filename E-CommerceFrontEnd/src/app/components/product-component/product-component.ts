import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css'
})
export class ProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected productService = inject(ProductService);

  // Signaux pour la pagination
  currentPage = signal(1);
  pageSize = signal(5); // Nombre de produits par page

  productForm: FormGroup;
  showForm = signal(false);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]], // Utilise null
      originalPrice: [null], // Utilise null
      stockQuantity: [null, [Validators.required, Validators.min(0)]], // Utilise null
      color: [''],
      categoryId: [null, Validators.required],
      description: ['']
    });
  }

  // Signal calculé pour extraire uniquement les produits de la page actuelle
  paginatedProducts = computed(() => {
    const products = this.productService.products();
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return products.slice(startIndex, startIndex + this.pageSize());
  });

  // Signal pour calculer le nombre total de pages
  totalPages = computed(() =>
    Math.ceil(this.productService.products().length / this.pageSize())
  );

  // Méthodes de navigation
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe();
  }

  toggleForm() {
    this.showForm.update(v => !v);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe({
        next: (res) => {
          // On rafraîchit la liste et on réinitialise le formulaire
          this.loadProducts();
          this.productForm.reset();
          this.showForm.set(false);
        },
        error: (err) => console.error('Erreur lors de l\'ajout', err)
      });
    }
  }

onDelete(event: Event, id: number | undefined) {
  event.stopPropagation();
  if (id && confirm('Voulez-vous vraiment supprimer ce produit ?')) {
    this.productService.deleteProduct(id).subscribe({
      error: (err) => alert(err.error) // Affiche le message d'erreur du Backend (ex: produit lié à une commande)
    });
  }
}
}
