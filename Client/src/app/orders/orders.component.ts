import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from './../shared/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orderList
  constructor(private orderService: OrderService, private router:Router, private toastr:ToastrService) {}

  ngOnInit(): void {
    this.refreshList();
  }
  refreshList(){
    this.orderService.getOrdersList().subscribe(res => this.orderList = res);
  }

  openForedit(orderId:number){
    this.router.navigateByUrl('/order/edit/'+ orderId);
  }

  onOrderdelete(id:number){
    if(confirm("Are you sure to delete this record?")){
    this.orderService.deleteOrder(id).subscribe(res =>{
     this.refreshList();
     this.toastr.warning('Order deleted Successfully', 'RestaurentApp');
    });
  }
  }
}
