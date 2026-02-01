import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/products'; // Vérifiez votre port

  // Optionnel : Un Signal pour stocker la liste des produits de manière réactive
  products = signal<Product[]>([]);

  // 1. Récupérer tous les produits
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(res => this.products.set(res)) // Met à jour le signal automatiquement
    );
  }

  // 2. Ajouter un produit (Utilise le endpoint /add)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }

  // 3. Récupérer par catégorie
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // 4. Supprimer un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => {
        // Optionnel : filtrer localement le signal pour une UI ultra-rapide
        this.products.update(prev => prev.filter(p => p.id !== id));
      })
    );
  }
}
