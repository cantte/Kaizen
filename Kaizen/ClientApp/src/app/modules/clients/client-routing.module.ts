import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '@app/shared/layouts/dashboard-layout/dashboard-layout.component';
import { DefaultLayoutComponent } from '@app/shared/layouts/default-layout/default-layout.component';
import { AdminOrOfficeEmployeeGuard } from '@core/guards/admin-or-office-employee.guard';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { ClientRegisterGuard } from '@core/guards/client-register.guard';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { ClientRequestDetailComponent } from './components/client-request-detail/client-request-detail.component';
import { ClientRequestsComponent } from './components/client-requests/client-requests.component';
import { ClientsComponent } from './components/clients/clients.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: ClientsComponent, canActivate: [ AuthGuard, AdminGuard ] },
      { path: 'register', component: ClientRegisterComponent, canActivate: [ ClientRegisterGuard ] },
      {
        path: 'requests',
        component: ClientRequestsComponent,
        canActivate: [ AuthGuard, AdminOrOfficeEmployeeGuard ]
      },
      {
        path: 'requests/:id',
        component: ClientRequestDetailComponent,
        canActivate: [ AuthGuard, AdminOrOfficeEmployeeGuard ]
      },
      {
        path: ':id',
        component: ClientDetailComponent,
        canActivate: [ AuthGuard, AdminOrOfficeEmployeeGuard ]
      }
    ]
  },
  {
    path: 'new',
    component: DefaultLayoutComponent,
    children: [ { path: 'register', component: ClientRegisterComponent, canActivate: [ ClientRegisterGuard ] } ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ClientRoutingModule {}
