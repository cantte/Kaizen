import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from '@modules/inventory/equipments/models/equipment';
import { EquipmentService } from '@modules/inventory/equipments/services/equipment.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ObservableStatus } from '@shared/models/observable-with-status';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html'
})
export class EquipmentsComponent implements OnInit, AfterViewInit {
  public ObsStatus: typeof ObservableStatus = ObservableStatus;

  equipments: Equipment[] = [];
  equipments$: Observable<Equipment[]>;

  dataSource: MatTableDataSource<Equipment> = new MatTableDataSource<Equipment>(this.equipments);
  displayedColumns: string[] = [ 'code', 'name', 'maintenanceDate', 'amount', 'price', 'options' ];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private equipmentService: EquipmentService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadEquipments();
  }

  private loadEquipments(): void {
    this.equipments$ = this.equipmentService.getEquipments();
    this.equipments$.subscribe((equipments) => {
      this.equipments = equipments;
      this.dataSource.data = this.equipments;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteEquipment(equipment: Equipment): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: `Está seguro de eliminar el equipo "${ equipment.name }", una vez confirmada la acción no podra revertirla.`
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
