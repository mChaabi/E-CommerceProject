import { User } from './user';
import { OrderItem } from './order-item';

export interface Order {
  id?: number;
  orderDate: string | Date;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  user: User; // Utilise l'interface User que tu as déjà
  orderItems: any[]; // Optionnel, si tu veux charger les détails
  // AJOUTE CES DEUX LIGNES :
  paymentMethod: 'CASH' | 'CREDIT' | '3ARBON';
  downPayment?: number;
}
