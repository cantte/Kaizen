import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { IForm } from '@core/models/form';
import { Equipment } from '@modules/inventory/equipments/models/equipment';
import { EquipmentService } from '@modules/inventory/equipments/services/equipment.service';
import { ObservableStatus } from '@shared/models/observable-with-status';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-select-equipments',
  templateUrl: './select-equipments.component.html'
})
export class SelectEquipmentsComponent implements OnInit, IForm {
  public ObsStatus: typeof ObservableStatus = ObservableStatus;

  equipments$: Observable<Equipment[]>;

  selectedEquipments: Equipment[] = [];

  selectEquipmentsForm: FormGroup;
  @ViewChildren('equipmentsListSelection') equipmentsListSelection: QueryList<MatSelectionList>;

  get controls(): { [key: string]: AbstractControl } {
    return this.selectEquipmentsForm.controls;
  }

  constructor(private equipmentService: EquipmentService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private loadData(): void {
    this.equipments$ = this.equipmentService.getEquipments();
    this.equipments$.pipe(delay(250)).subscribe((equipments) => {
      this.selectEquipments();
    });
  }

  initForm(): void {
    this.selectEquipmentsForm = this.formBuilder.group({
      equipmentCode: [ '' ],
      showSelectedEquipments: [ false ],
      equipmentCodes: [ '', [ Validators.required ] ]
    });

    this.controls['equipmentCode'].valueChanges.pipe(delay(100)).subscribe((value) => {
      this.selectEquipments();
    });

    this.controls['showSelectedEquipments'].valueChanges.subscribe((value) => {
      if (value) {
        this.controls['equipmentCode'].disable();
      } else {
        this.controls['equipmentCode'].enable();
      }
    });
  }

  selectEquipments(): void {
    if (
      this.selectedEquipments.length === 0 ||
      this.equipmentsListSelection.first === undefined ||
      this.equipmentsListSelection.first.options === undefined
    ) {
      return;
    }

    const selectedOptions = this.equipmentsListSelection.first.options.filter((option) => {
      return this.selectedEquipments.some((e) => e.code === option.value.code);
    });

    this.equipmentsListSelection.first.selectedOptions.select(...selectedOptions);
  }

  onSelectEquipment(event: MatSelectionListChange): void {
    const option = event.option;
    const value = option.value;
    if (option.selected) {
      this.selectedEquipments.push(value);
    } else {
      const index = this.selectedEquipments.indexOf(value);
      if (index !== -1) {
        this.selectedEquipments.splice(index, 1);
      }
    }
  }

  get valid(): boolean {
    return this.selectEquipmentsForm.valid;
  }

  get invalid(): boolean {
    return !this.valid;
  }

  get value(): any {
    if (this.selectedEquipments.length === 0) {
      return null;
    }
    return this.controls['equipmentCodes'].value.map((p: Equipment) => p.code);
  }

  setValue(value: Equipment[]): void {
    this.selectedEquipments = value;
    this.selectEquipments();
  }
}
