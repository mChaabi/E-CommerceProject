import { Component, OnInit, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
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
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  @ViewChild('salesChart') salesChartCanvas!: ElementRef;

  // Signaux pour les statistiques
  totalRevenue = signal(0);
  orderCount = signal(0);
  productCount = signal(0);
  categoryCount = signal(0);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // Chargement des commandes pour les stats de revenus
    this.orderService.getUserOrders(1).subscribe(orders => {
      this.orderCount.set(orders.length);
      const revenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
      this.totalRevenue.set(revenue);
      this.initChart(orders);
    });

    // Chargement des produits et catégories
    this.productService.getAllProducts().subscribe(res => this.productCount.set(res.length));
    this.categoryService.getAllCategories().subscribe(res => this.categoryCount.set(res.length));
  }

  initChart(orders: any[]) {
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
}
