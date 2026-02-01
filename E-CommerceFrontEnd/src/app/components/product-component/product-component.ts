import { Component, OnInit, inject, signal } from '@angular/core';
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

  onDelete(id: number | undefined) {
    if (id && confirm('Supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe();
    }
  }
}
