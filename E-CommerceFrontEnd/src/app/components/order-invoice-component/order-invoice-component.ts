import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-order-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-invoice-component.html',
  styleUrl: './order-invoice-component.css'
})
export class OrderInvoiceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = signal<any>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // On charge la commande spécifique
      this.orderService.getUserOrders(1).subscribe(orders => {
        const found = orders.find(o => o.id === Number(id));
        if (found) {
          this.order.set(found);
        } else {
          this.goBack();
        }
      });
    }
  }

  printInvoice() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
