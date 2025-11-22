import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddPatient } from './pages/orders/patient/add-patient/add-patient';
import { CaseInformation } from './pages/orders/case-information/case-information';
import { CreateNewOrder } from './pages/orders/create-new-order/create-new-order';
import { InsuranceInformation } from './pages/orders/insurance-information/insurance-information';
import { ManageOrders } from './pages/orders/manage-orders/manage-orders';
import { OrderInformation } from './pages/orders/order-information/order-information';
import { Preview } from './pages/orders/preview/preview';
import { AllOrders } from './pages/orders/all-orders/all-orders';
import { PendingOrders } from './pages/orders/pending-orders/pending-orders';
import { Projects } from './pages/orders/projects/projects';
import { Layout } from './layout/layout';
import { AddFacility } from './pages/facility/add-facility/add-facility';
import { AddPhysician } from './pages/physician/add-physician/add-physician';
import { Facilities } from './pages/facility/facilities/facilities';
import { Physicians } from './pages/physician/physicians/physicians/physicians';
import { Patients } from './pages/orders/patient/patients/patients';
import { InsuranceListComponent } from './pages/insurance/insurance-list/list_insurance';
import { AddInsuranceComponent } from './pages/insurance/add-insurance/add-insurance';

export const routes: Routes = [
  { path: '', redirectTo: '/layout/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: 'layout', component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'manage-orders', component: ManageOrders },
      { path: 'all-orders', component: AllOrders },
      { path: 'pending-orders', component: PendingOrders },
      { path: 'projects', component: Projects },
      { path: 'add-patient', component: AddPatient },
      { path: 'create-new-order', component: CreateNewOrder },
      { path: 'case-information', component: CaseInformation },
      { path: 'order-information', component: OrderInformation },
      { path: 'insurance-information', component: InsuranceInformation },
      { path: 'preview', component: Preview },
      { path: 'add-facility', component: AddFacility },
      { path: 'add-facility/:guid', component: AddFacility },
      { path: 'facilities', component: Facilities },
      { path: 'add-physician', component: AddPhysician },
      { path: 'add-physician/:guid', component: AddPhysician },
      { path: 'physicians', component: Physicians },
      { path: 'add-patient', component: AddPatient },
      { path: 'add-patient/:guid', component: AddPatient },
      { path: 'patients', component: Patients },
      { path: 'add-insurance', component: AddInsuranceComponent },
      { path: 'add-insurance/:guid', component: AddInsuranceComponent },
      { path: 'insurance-list', component: InsuranceListComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
