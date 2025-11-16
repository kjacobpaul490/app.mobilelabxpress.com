import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { StatusBar } from './status-bar/status-bar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    StatusBar
  ]
})
export class OrdersModule { }
