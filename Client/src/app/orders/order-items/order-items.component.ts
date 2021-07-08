import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderItem } from 'src/app/shared/order-item.model';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css'],
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>
  ) {}

  ngOnInit(): void {
    this.formData = {
      OrderItemId: null,
      OrderId: this.data.orderId,
      ItemId: 0,
      ItemName: '',
      Price: 0,
      Quantity: 0,
      Total: 0,
    };
  }
}
