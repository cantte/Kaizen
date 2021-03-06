import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Certificate } from '@modules/certificates/models/certificate';
import { CertificateService } from '@modules/certificates/services/certificate.service';
import { ObservableStatus } from '@shared/models/observable-with-status';
import { Observable } from 'rxjs';
import { downloadFile } from '@core/utils/file-utils';

@Component({
  selector: 'app-certificate-detail',
  templateUrl: './certificate-detail.component.html',
})
export class CertificateDetailComponent implements OnInit {
  public ObsStatus: typeof ObservableStatus = ObservableStatus;

  certificate$: Observable<Certificate>;

  constructor(private certificateService: CertificateService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.certificate$ = this.certificateService.getCertificate(id);

    this.certificate$.subscribe(result => console.log(result));
  }

  downloadCertificate(certificate: Certificate): void {
    this.certificateService.downloadCertificate(certificate.id).subscribe(result => {
      if (result) {
        downloadFile(result);
      }
    });
  }
}
