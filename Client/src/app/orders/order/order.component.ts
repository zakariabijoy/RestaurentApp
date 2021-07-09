import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let orderId = this.currentRouter.snapshot.paramMap.get('id');
    if(orderId == null){
      this.resetForm();
    }
    else{
      this.orderService.getOrderById(parseInt(orderId)).subscribe(res => {
        console.log(res);
        this.orderService.formData = res.order;
        this.orderService.orderItems = res.orderDetails;
      });
    }
    this.customerService
      .getCustomerList()
      .subscribe((res) => (this.customerList = res as Customer[]));
  }

  resetForm(form?: NgForm) {
    if ((form = null)) form.resetForm();
    this.orderService.formData = {
      orderrId: null,
      orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      customerId: 0,
      pmethod: '',
      gtotal: 0,
      deletedOrderItemsIds:''
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
    if(orderItemId !==null){
      this.orderService.formData.deletedOrderItemsIds += orderItemId + ',';
    }
    this.orderService.orderItems.splice(index, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.orderService.formData.gtotal = this.orderService.orderItems.reduce(
      (prev, curr) => {
        return prev + curr.total;
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
      this.orderService.saveOrUpdateOrder().subscribe((res) => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'RestaurentApp');
        this.router.navigateByUrl('/orders');
      });
    }
  }
}
