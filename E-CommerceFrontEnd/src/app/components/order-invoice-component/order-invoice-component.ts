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
  orders :any[] = [];
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getUserOrders(1).subscribe((response: any) => {
        const found = this.orders.find((o: { id: number }) => o.id === Number(id));
        console.log("Commande pour facture :", found); // Vérifie ici si paymentMethod est présent
        if (found) {
          this.order.set(found);
          this.order = response.content; // Assuming 'response' is an object with a 'content' property
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
    this.router.navigate(['/commandes']);
  }
}
