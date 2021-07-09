import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  formData: Order;
  orderItems: OrderItem[];
  constructor(private http: HttpClient) {}

  getOrdersList() {
    return this.http.get(environment.apiURL + '/Orders');
  }

  saveOrUpdateOrder() {
    this.formData.orderId = 0;
    this.orderItems.forEach((x) => {
      x.OrderId = 0;
      x.OrderItemId = 0;
    });
    var body = {
      ...this.formData,
      orderItems: this.orderItems,
    };
    console.log(body);
    return this.http.post(environment.apiURL + '/Orders', body);
  }
}
