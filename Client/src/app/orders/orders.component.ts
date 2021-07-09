import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from './../shared/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orderList
  constructor(private orderService: OrderService, private router:Router) {}

  ngOnInit(): void {
    this.orderService.getOrdersList().subscribe(res => this.orderList = res);
  }

  openForedit(orderId:number){
    this.router.navigateByUrl('/order/edit/'+ orderId);
  }
}
