import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageOrders } from './manage-orders/manage-orders';
import { CreateNewOrder } from './create-new-order/create-new-order';
import { AddPatient } from './add-patient/add-patient';
import { CaseInformation } from './case-information/case-information';
import { OrderInformation } from './order-information/order-information';
import { InsuranceInformation } from './insurance-information/insurance-information';
import { Preview } from './preview/preview';

const routes: Routes = [

  { path: 'manage-orders', component: ManageOrders },
  { path: 'add-patient', component: AddPatient },
  { path: 'create-new-order', component: CreateNewOrder },
  { path: 'case-information', component: CaseInformation },
  { path: 'order-information', component: OrderInformation },
  { path: 'insurance-information', component: InsuranceInformation },
  { path: 'preview', component: Preview },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
