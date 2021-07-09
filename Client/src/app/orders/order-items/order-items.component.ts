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
  isValid: boolean = true;

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

    if (this.data.orderItemIndex == null) {
      this.formData = {
        orderItemId: null,
        orderId: this.data.orderId,
        itemId: 0,
        itemName: '',
        price: 0,
        quantity: 0,
        total: 0,
      };
    } else {
      this.formData = Object.assign(
        {},
        this.orderSerice.orderItems[this.data.orderItemIndex]
      );
    }
  }

  updatePrice(event: any) {
    if (event.selectedIndex == 0) {
      this.formData.price = 0;
      this.formData.itemName = '';
    } else {
      this.formData.price = this.itemList[event.selectedIndex - 1].price;
      this.formData.itemName = this.itemList[event.selectedIndex - 1].name;
    }

    this.updateTotal();
  }

  updateTotal() {
    this.formData.total = parseFloat(
      (this.formData.quantity * this.formData.price).toFixed(2)
    );
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      if (this.data.orderItemIndex == null)
        this.orderSerice.orderItems.push(form.value);
      else this.orderSerice.orderItems[this.data.orderItemIndex] = form.value;
      this.dialogRef.close();
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.itemId == 0) this.isValid = false;
    else if (formData.quantity == 0) this.isValid = false;
    return this.isValid;
  }
}
