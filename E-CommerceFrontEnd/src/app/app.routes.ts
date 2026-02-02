import { Routes } from '@angular/router';
import { ProductComponent } from './components/product-component/product-component';
import { CategoryComponent } from './components/category-component/category-component';
import { OrderComponent } from './components/order-component/order-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { OrderInvoiceComponent } from './components/order-invoice-component/order-invoice-component';

export const routes: Routes = [
  // 1. Route racine : Redirection immédiate vers /dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 2. Définition des routes
  { path: 'dashboard', component: DashboardComponent }, // ✅ Minuscule recommandée
  { path: 'produits', component: ProductComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'commandes', component: OrderComponent },
  { path: 'orders/invoice/:id', component: OrderInvoiceComponent },

  // 3. Gestion de l'erreur 404 (Optionnel mais conseillé)
  // Si l'utilisateur tape une URL qui n'existe pas, on le renvoie au Dashboard
  { path: '**', redirectTo: 'dashboard' }
];
