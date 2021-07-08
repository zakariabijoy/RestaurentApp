import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/shared/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { OrderItem } from 'src/app/shared/order-item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css'],
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderSerice: OrderService
  ) {}

  ngOnInit(): void {
    this.itemService
      .getItemList()
      .subscribe((res) => (this.itemList = res as Item[]));

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

  updatePrice(event: any) {
    if (event.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    } else {
      this.formData.Price = this.itemList[event.selectedIndex - 1].price;
      this.formData.ItemName = this.itemList[event.selectedIndex - 1].name;
    }

    this.updateTotal();
  }

  updateTotal() {
    this.formData.Total = parseFloat(
      (this.formData.Quantity * this.formData.Price).toFixed(2)
    );
  }

  onSubmit(form: NgForm) {
    this.orderSerice.orderItems.push(form.value);
    this.dialogRef.close();
  }
}
