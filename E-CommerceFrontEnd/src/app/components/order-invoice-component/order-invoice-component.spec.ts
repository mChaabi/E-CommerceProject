import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInvoiceComponent } from './order-invoice-component';

describe('OrderInvoiceComponent', () => {
  let component: OrderInvoiceComponent;
  let fixture: ComponentFixture<OrderInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderInvoiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
