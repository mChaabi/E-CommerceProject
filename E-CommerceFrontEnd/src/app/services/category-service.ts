import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , tap} from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categories'; // Ajustez selon votre controller

  categories = signal<Category[]>([]);

 getAllCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.apiUrl).pipe(
    tap(res => this.categories.set(res)) // <--- AJOUTE CECI pour remplir le tableau
  );
}

  // Créer une catégorie (le formulaire enverra un objet Category)
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/add`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => {
        // Mise à jour réactive locale du signal
        this.categories.update(prev => prev.filter(c => c.id !== id));
      })
    );
  }
}
