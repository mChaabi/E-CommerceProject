import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected categoryService = inject(CategoryService);
  protected productService = inject(ProductService);

  categoryForm: FormGroup;
  showForm = signal(false);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        // Cette Regex impose de commencer par une lettre et interdit les répétitions absurdes de consonnes
        Validators.pattern(/^[A-ZÀ-ÿ][a-zà-ÿ0-9\s&]{2,30}$/)
      ]],
      description: ['', [
        Validators.required, // On la rend obligatoire pour éviter le vide
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe();
  }

  toggleForm() {
    this.showForm.update(v => !v);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories(); // Recharge la liste
          this.categoryForm.reset();
          this.showForm.set(false);
        }
      });
    }
  }

 onDelete(id: number | undefined) {
    if (id && confirm('Supprimer cet élément ?')) {
      // CAMBIA productService por categoryService
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          console.log('Supprimé con éxito');
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }
}
