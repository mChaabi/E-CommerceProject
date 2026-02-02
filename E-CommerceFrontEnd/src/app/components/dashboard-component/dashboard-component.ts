import { Component, OnInit, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order-service';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit {
  // --- Injections ---
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  // --- ViewChild (Canvas) ---
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  @ViewChild('topProductsChart') topProductsCanvas!: ElementRef;
  @ViewChild('paymentMethodsChart') paymentMethodsCanvas!: ElementRef;

  // --- Signaux (État) ---
  totalRevenue = signal(0);
  orderCount = signal(0);
  productCount = signal(0);
  categoryCount = signal(0);

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Charge les données depuis les services
   */
  loadData() {
    // 1. Statistiques Globales & Graphiques basés sur les commandes
    this.orderService.getUserOrders(1).subscribe(orders => {
      this.orderCount.set(orders.length);

      const revenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
      this.totalRevenue.set(revenue);

      // Initialisation des graphiques
      this.initSalesChart(orders);
      this.initTopProductsChart(orders);
      this.initPaymentChart(orders);
    });

    // 2. Statistiques Produits
    this.productService.getAllProducts().subscribe(res => {
      this.productCount.set(res.length);
    });

    // 3. Statistiques Catégories
    this.categoryService.getAllCategories().subscribe(res => {
      this.categoryCount.set(res.length);
    });
  }

  /**
   * Graphique 1 : Évolution des ventes (Line Chart)
   */
  private initSalesChart(orders: any[]) {
    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: orders.map(o => new Date(o.orderDate).toLocaleDateString()),
        datasets: [{
          label: 'Ventes (€)',
          data: orders.map(o => o.totalAmount),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  /**
   * Graphique 2 : Meilleurs Produits (Doughnut Chart)
   */
  private initTopProductsChart(orders: any[]) {
    const productCounts: { [key: string]: number } = {};

    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
      });
    });

    const labels = Object.keys(productCounts).slice(0, 10);
    const data = Object.values(productCounts).slice(0, 10);
    const ctx = this.topProductsCanvas.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantité vendue',
          data: data,
          backgroundColor: [
            '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#06b6d4', '#ec4899', '#f97316', '#64748b', '#7c3aed'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: labels.length <= 10,
            position: 'right'
          }
        }
      }
    });
  }

  /**
   * Graphique 3 : Modes de paiement (Doughnut Chart)
   */
  private initPaymentChart(orders: any[]) {
    const paymentCounts: { [key: string]: number } = {
      'CASH': 0,
      'CREDIT': 0,
      '3ARBON': 0
    };

    orders.forEach(order => {
      if (order.paymentMethod) {
        paymentCounts[order.paymentMethod] = (paymentCounts[order.paymentMethod] || 0) + 1;
      }
    });

    const ctx = this.paymentMethodsCanvas.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(paymentCounts),
        datasets: [{
          data: Object.values(paymentCounts),
          backgroundColor: [
            '#10b981', // Vert pour CASH
            '#ef4444', // Rouge pour CREDIT
            '#f59e0b'  // Orange pour 3ARBON
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
