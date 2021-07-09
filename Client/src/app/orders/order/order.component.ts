import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from 'src/app/shared/customer.model';
import { CustomerService } from 'src/app/shared/customer.service';
import { OrderService } from 'src/app/shared/order.service';
import { OrderItemsComponent } from '../order-items/order-items.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid: boolean = true;

  constructor(
    public orderService: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.resetForm();
    this.customerService
      .getCustomerList()
      .subscribe((res) => (this.customerList = res as Customer[]));
  }

  resetForm(form?: NgForm) {
    if ((form = null)) form.resetForm();
    this.orderService.formData = {
      orderId: null,
      orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      customerId: 0,
      pMethod: '',
      gtotal: 0,
    };
    this.orderService.orderItems = [];
  }
  AddOrEditOrderItem(orderItemIndex, orderId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex, orderId };
    this.dialog
      .open(OrderItemsComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.updateGrandTotal();
      });
  }

  onDeleteOrderItem(orderItemId: number, index: number) {
    this.orderService.orderItems.splice(index, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.orderService.formData.gtotal = this.orderService.orderItems.reduce(
      (prev, curr) => {
        return prev + curr.Total;
      },
      0
    );

    this.orderService.formData.gtotal = parseFloat(
      this.orderService.formData.gtotal.toFixed(2)
    );
  }
  validateForm() {
    this.isValid = true;
    if (this.orderService.formData.customerId == 0) this.isValid = false;
    else if (this.orderService.orderItems.length == 0) this.isValid = false;
    return this.isValid;
  }
  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.orderService.saveOrUpdateOrder().subscribe(res =>{
        this.resetForm();
      });
    }
  }
}
