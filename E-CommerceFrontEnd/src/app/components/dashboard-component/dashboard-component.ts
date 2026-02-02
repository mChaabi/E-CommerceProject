import { Component, OnInit, inject, signal, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit {
  // --- Injections ---
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  // --- ViewChild (Canvas pour Chart.js) ---
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  @ViewChild('topProductsChart') topProductsCanvas!: ElementRef;
  @ViewChild('paymentMethodsChart') paymentMethodsCanvas!: ElementRef;

  // --- Signaux pour les Statistiques ---
  totalRevenue = signal(0);
  orderCount = signal(0);
  revenueToday = signal(0);
  revenueMonth = signal(0);
  revenueYear = signal(0);
  productCount = signal(0);
  categoryCount = signal(0);



  // --- Signaux pour la Recherche et le Tableau ---
  allOrders: any[] = [];
  filteredOrders = signal<any[]>([]);
  searchDate = signal(new Date().toISOString().split('T')[0]); // Date du jour par défaut

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // 1. Charger les commandes et calculer tout ce qui en dépend
    this.orderService.getUserOrders(1).subscribe(orders => {
      this.allOrders = orders;
      this.orderCount.set(orders.length);

      // Calcul des statistiques globales
      this.calculateStats(orders);

      // Filtrer les commandes pour le tableau (init avec la date du jour)
      this.onSearchDateChange(this.searchDate());

      // Initialisation des graphiques (Utiliser setTimeout pour s'assurer que le DOM est prêt)
      setTimeout(() => {
        this.initSalesChart(orders);
        this.initTopProductsChart(orders);
        this.initPaymentChart(orders);
      }, 0);
    });

    // 2. Statistiques Produits
    this.productService.getAllProducts().subscribe(res => this.productCount.set(res.length));

    // 3. Statistiques Catégories
    this.categoryService.getAllCategories().subscribe(res => this.categoryCount.set(res.length));
  }


  // Add this line:
  totalFilteredRevenue = computed(() => {
    return this.filteredOrders().reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  });
  // --- Logique de Recherche ---
  onSearchDateChange(newDate: string) {
    this.searchDate.set(newDate);
    const filtered = this.allOrders.filter(order => {
      const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0];
      return orderDateStr === newDate;
    });
    this.filteredOrders.set(filtered);
  }

  // --- Calcul des Statistiques ---
  private calculateStats(orders: any[]) {
    const now = new Date();
    const todayStr = now.toLocaleDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0, today = 0, month = 0, year = 0;

    orders.forEach(o => {
      const oDate = new Date(o.orderDate);
      const amount = o.totalAmount;
      total += amount;

      if (oDate.toLocaleDateString() === todayStr) today += amount;
      if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear) month += amount;
      if (oDate.getFullYear() === currentYear) year += amount;
    });

    this.totalRevenue.set(total);
    this.revenueToday.set(today);
    this.revenueMonth.set(month);
    this.revenueYear.set(year);
  }

  // --- Initialisation des Graphiques ---

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
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

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
          data: data,
          backgroundColor: [
            '#4f46e5', // Indigo (existant)
            '#10b981', // Émeraude (existant)
            '#f59e0b', // Ambre (existant)
            '#ef4444', // Rouge (existant)
            '#8b5cf6', // Violet (existant)
            '#ec4899', // Rose
            '#06b6d4', // Cyan
            '#84cc16', // Citron vert
            '#f97316', // Orange
            '#64748b'  // Ardoise / Gris bleu
          ]
        }]
      }
    });
  }

  private initPaymentChart(orders: any[]) {
    const paymentCounts: { [key: string]: number } = { 'CASH': 0, 'CREDIT': 0, '3ARBON': 0 };
    orders.forEach(order => {
      if (order.paymentMethod) paymentCounts[order.paymentMethod]++;
    });

    const ctx = this.paymentMethodsCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(paymentCounts),
        datasets: [{
          data: Object.values(paymentCounts),
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
        }]
      }
    });
  }
}
