import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';

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

  categoryForm: FormGroup;
  showForm = signal(false);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
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
    if (id && confirm('Supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }
}
