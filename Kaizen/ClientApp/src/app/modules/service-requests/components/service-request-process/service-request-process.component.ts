import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '@modules/employees/models/employee';
import { EmployeeService } from '@modules/employees/services/employee.service';
import { ServiceRequest } from '@modules/service-requests/models/service-request';
import { ServiceRequestState } from '@modules/service-requests/models/service-request-state';
import { ServiceRequestService } from '@modules/service-requests/services/service-request.service';
import { SelectDateModalComponent } from '@shared/components/select-date-modal/select-date-modal.component';
import { ObservableStatus } from '@shared/models/observable-with-status';
import { DialogsService } from '@shared/services/dialogs.service';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-service-request-process',
  templateUrl: './service-request-process.component.html'
})
export class ServiceRequestProcessComponent implements OnInit {
  public ObsStatus: typeof ObservableStatus = ObservableStatus;

  serviceRequest: ServiceRequest;
  techniciansAvailable$: Observable<Employee[]>;

  serviceRequestCode: number;

  updatingServiceRequest = false;

  constructor(
    private serviceRequestService: ServiceRequestService,
    private employeeService: EmployeeService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    public dateDialog: MatDialog,
    private dialogsService: DialogsService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.serviceRequestCode = +this.activateRoute.snapshot.paramMap.get('code');
  }

  onLoadedServiceRequest(serviceRequest: ServiceRequest): void {
    this.serviceRequest = serviceRequest;
    const serviceCodes = serviceRequest.services.map((service) => service.code);
    this.techniciansAvailable$ = this.employeeService.getTechniciansAvailable(serviceRequest.date, serviceCodes);
  }

  cancelServiceRequest(): void {
    this.serviceRequest.state = ServiceRequestState.Rejected;
    this.updatingServiceRequest = true;
    this.serviceRequestService.updateServiceRequest(this.serviceRequest).subscribe((serviceRequestUpdate) => {
      if (serviceRequestUpdate) {
        this.router.navigateByUrl('/service_requests');
      }
    });
  }

  suggestAnotherDate(): void {
    const dateRef = this.dateDialog.open(SelectDateModalComponent, {
      width: '700px'
    });

    dateRef
      .afterClosed()
      .pipe(
        filter((value) => value !== null && value !== undefined),
        switchMap((date) => {
          if (date) {
            this.serviceRequest.date = date;
            this.serviceRequest.state = ServiceRequestState.PendingSuggestedDate;
            this.updatingServiceRequest = true;

            return this.serviceRequestService.updateServiceRequest(this.serviceRequest);
          }
        })
      )
      .subscribe((serviceRequestUpdate) => {
        if (serviceRequestUpdate) {
          this.dialogsService.showSuccessDialog(`Fecha de solicitud de servicio modificada con éxito`, () => {
            this.router.navigateByUrl('/service_requests');
          });
        }
      });
  }
}
