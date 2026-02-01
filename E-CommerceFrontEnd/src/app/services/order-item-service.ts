import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/order-items';

  // 1. Récupérer tous les articles d'une commande spécifique
  getItemsByOrder(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/order/${orderId}`);
  }

  // 2. Mettre à jour la quantité d'un article (PATCH)
  // Utilise @RequestParam dans le Backend, donc on utilise HttpParams ici
  updateQuantity(id: number, quantity: number): Observable<OrderItem> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.patch<OrderItem>(`${this.apiUrl}/${id}/quantity`, {}, { params });
  }

  // 3. Supprimer un article d'une commande
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
