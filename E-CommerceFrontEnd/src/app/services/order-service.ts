import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  // 1. Créer une commande
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/add`, order);
  }

  // 2. Récupérer les commandes d'un utilisateur
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 3. Mettre à jour le statut (utilise @PatchMapping avec RequestParam)
  updateStatus(id: number, status: string): Observable<string> {
    const params = new HttpParams().set('status', status);
    return this.http.patch(`${this.apiUrl}/${id}/status`, {}, {
      params,
      responseType: 'text'
    });
  }

  // 4. Mettre à jour une commande complète (PUT)
  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  // 5. Supprimer une commande
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
