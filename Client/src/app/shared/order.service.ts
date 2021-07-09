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

  getOrderById(id:number) :any {
    return this.http.get(environment.apiURL + '/Orders/'+id);
  }

  saveOrUpdateOrder() {
    if(this.formData.orderrId === null) this.formData.orderrId =0;
    this.orderItems.forEach(x =>{
      if(x.orderItemId === null){
        x.orderItemId =0;
        x.orderId = 0;
      }
    });
    var body = {
      ...this.formData,
      orderItems: this.orderItems,
    };
    console.log(body);
    return this.http.post(environment.apiURL + '/Orders', body);
  }
}
