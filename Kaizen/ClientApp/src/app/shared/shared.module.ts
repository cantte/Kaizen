import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@core/material.module';
import { AboutComponent } from '@shared/components/about/about.component';
import { DashboardCardComponent } from '@shared/components/dashboard-card/dashboard-card.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { HomeComponent } from '@shared/components/home/home.component';
import { NavMenuComponent } from '@shared/components/nav-menu/nav-menu.component';
import { OurservicesComponent } from '@shared/components/ourservices/ourservices.component';
import { Page404Component } from '@shared/components/page404/page404.component';
import { UniqueClientDirective } from '@shared/directives/unique-client.directive';
import { UniqueEmployeeDirective } from '@shared/directives/unique-employee.directive';
import { UniqueEquipmentDirective } from '@shared/directives/unique-equipment.directive';
import { UniqueProductDirective } from '@shared/directives/unique-product.directive';
import { UniqueUserDirective } from '@shared/directives/unique-user.directive';
import { ClientsFilterPipe } from '@shared/pipes/clients-filter.pipe';
import { MonthBitPipe } from '@shared/pipes/month-bit.pipe';
import { HttpErrorHandlerService } from '@shared/services/http-error-handler.service';
import { NotificationsService } from '@shared/services/notifications.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { MatAutocompleteChipListInputComponent } from './components/mat-autocomplete-chip-list-input/mat-autocomplete-chip-list-input.component';
import { SelectDateModalComponent } from './components/select-date-modal/select-date-modal.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { LoadingButtonDirective } from './directives/loading-button.directive';
import { ActivityStatePipe } from './pipes/activity-state.pipe';
import { ClientStatePipe } from './pipes/client-state.pipe';
import { FilterEmployeesPipe } from './pipes/filter-employees.pipe';
import { FilterEquipmentsPipe } from './pipes/filter-equipments.pipe';
import { FilterProductsPipe } from './pipes/filter-products.pipe';
import { InvoiceStatePipe } from './pipes/invoice-state.pipe';
import { PaymentMethodPipe } from './pipes/payment-method.pipe';
import { PeriodicityPipe } from './pipes/periodicity.pipe';
import { ServiceRequestStatePipe } from './pipes/service-request-state.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    Page404Component,
    HeaderComponent,
    FooterComponent,
    NavMenuComponent,
    AboutComponent,
    OurservicesComponent,
    DashboardCardComponent,
    MatAutocompleteChipListInputComponent,
    UniqueClientDirective,
    UniqueEmployeeDirective,
    UniqueEquipmentDirective,
    UniqueProductDirective,
    UniqueUserDirective,
    ClientsFilterPipe,
    MonthBitPipe,
    SelectDateModalComponent,
    PeriodicityPipe,
    ServiceRequestStatePipe,
    DigitalSignatureComponent,
    ActivityStatePipe,
    ConfirmDialogComponent,
    ClientStatePipe,
    FilterProductsPipe,
    FilterEquipmentsPipe,
    FilterEmployeesPipe,
    InvoiceStatePipe,
    PaymentMethodPipe,
    SuccessDialogComponent,
    ErrorDialogComponent,
    LoadingButtonDirective
  ],
  imports: [ CommonModule, FlexLayoutModule, MaterialModule, RouterModule, FormsModule, ReactiveFormsModule ],
  exports: [
    CommonModule,
    MaterialModule,
    MaterialFileInputModule,
    FlexLayoutModule,
    HomeComponent,
    Page404Component,
    HeaderComponent,
    FooterComponent,
    NavMenuComponent,
    AboutComponent,
    OurservicesComponent,
    DashboardCardComponent,
    MatAutocompleteChipListInputComponent,
    DigitalSignatureComponent,
    UniqueClientDirective,
    UniqueUserDirective,
    UniqueEmployeeDirective,
    UniqueEquipmentDirective,
    UniqueProductDirective,
    ClientsFilterPipe,
    MonthBitPipe,
    PeriodicityPipe,
    ServiceRequestStatePipe,
    ActivityStatePipe,
    ConfirmDialogComponent,
    ClientStatePipe,
    FilterProductsPipe,
    FilterEquipmentsPipe,
    FilterEmployeesPipe,
    InvoiceStatePipe,
    PaymentMethodPipe,
    LoadingButtonDirective
  ],
  providers: [ NotificationsService, HttpErrorHandlerService ]
})
export class SharedModule {}
