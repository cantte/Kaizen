import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { FileResponse } from '@core/models/file-response';
import { IForm } from '@core/models/form';
import { ApplicationMonths, APPLICATION_MONTHS, MonthBit } from '@core/models/months';
import { UploadDownloadService } from '@core/services/upload-download.service';
import { Product } from '@modules/inventory/products/models/product';
import { ProductService } from '@modules/inventory/products/services/product.service';
import { DialogsService } from '@shared/services/dialogs.service';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html'
})
export class ProductRegisterComponent implements OnInit, IForm {
  allMonths: MonthBit[];
  applicationMonths: ApplicationMonths;
  @ViewChildren('monthSelect') monthSelect: QueryList<MatSelect>;

  productForm: FormGroup;
  productDocumentsForm: FormGroup;
  uploading = false;
  uploadP: number;

  savingData = false;

  public get controls(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }

  public get documents_controls(): { [key: string]: AbstractControl } {
    return this.productDocumentsForm.controls;
  }

  constructor(
    private productService: ProductService,
    private uploadDownloadService: UploadDownloadService,
    private formBuilder: FormBuilder,
    private dialogsService: DialogsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.initProductDocumentsForm();

    this.allMonths = APPLICATION_MONTHS;
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      code: [
        '',
        {
          validators: [ Validators.required ],
          updateOn: 'blur'
        }
      ],
      name: [ '', [ Validators.required, Validators.maxLength(40) ] ],
      description: [ '', [ Validators.required, Validators.maxLength(300) ] ],
      amount: [ '', [ Validators.required ] ],
      presentation: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      applicationMonths: [ '', [ Validators.required ] ]
    });
  }

  private initProductDocumentsForm(): void {
    this.productDocumentsForm = this.formBuilder.group({
      dataSheet: [ '', [ Validators.required ] ],
      healthRegister: [ '', [ Validators.required ] ],
      safetySheet: [ '', [ Validators.required ] ],
      emergencyCard: [ '', [ Validators.required ] ]
    });
  }

  onSelectMonth(event: MatSelectChange): void {
    const option = event.source;
    const values = option.value as [];
    this.applicationMonths = 0;
    values.forEach((value) => {
      // tslint:disable-next-line: no-bitwise
      this.applicationMonths |= value;
    });
  }

  onSubmit() {
    if (this.productForm.valid && this.productDocumentsForm.valid) {
      this.savingData = true;
      this.uploadDocuments().subscribe((result) => {
        if (result.type === HttpEventType.UploadProgress) {
          this.uploadP = Math.round(100 * (result.loaded / result.total));
        } else if (result.type === HttpEventType.Response) {
          const fileNames = result.body;
          this.uploading = false;
          const product = this.mapProduct(fileNames);

          this.productService.saveProduct(product).subscribe((productSave) => {
            this.dialogsService.showSuccessDialog(
              `El producto ${ productSave.name } fue registrado con éxito`,
              () => {
                this.router.navigateByUrl('/inventory/products');
              }
            );
          });
        }
      });
    }
  }

  private mapProduct(fileNames: FileResponse[]): Product {
    return {
      ...this.productForm.value,
      dataSheet: fileNames[0].fileName,
      healthRegister: fileNames[1].fileName,
      safetySheet: fileNames[2].fileName,
      emergencyCard: fileNames[3].fileName,
      applicationMonths: this.applicationMonths
    };
  }

  private uploadDocuments() {
    const dataSheet = <File>this.documents_controls['dataSheet'].value.files[0];
    const healthRegister = <File>this.documents_controls['healthRegister'].value.files[0];
    const safetySheet = <File>this.documents_controls['safetySheet'].value.files[0];
    const emergencyCard = <File>this.documents_controls['emergencyCard'].value.files[0];

    const files = [ dataSheet, healthRegister, safetySheet, emergencyCard ];
    this.uploading = true;

    return this.uploadDownloadService.uploadFiles(files);
  }
}
