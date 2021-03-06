import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PRODUCT_INVOICES_API_URL } from '@global/endpoints';
import { ProductInvoice } from '@modules/payments/models/product-invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductInvoiceService {
  constructor(private http: HttpClient) {}

  getProductInvoices(): Observable<ProductInvoice[]> {
    return this.http.get<ProductInvoice[]>(`${PRODUCT_INVOICES_API_URL}`);
  }

  getClientProductInvoices(clientId: string): Observable<ProductInvoice[]> {
    return this.http.get<ProductInvoice[]>(`${PRODUCT_INVOICES_API_URL}/ClientInvoices/${clientId}`);
  }

  getProductInvoice(id: number): Observable<ProductInvoice> {
    return this.http.get<ProductInvoice>(`${PRODUCT_INVOICES_API_URL}/${id}`);
  }

  saveProductInvoice(productInvoice: ProductInvoice): Observable<ProductInvoice> {
    return this.http.post<ProductInvoice>(`${PRODUCT_INVOICES_API_URL}`, productInvoice);
  }

  updateProductInvoice(productInvoice: ProductInvoice): Observable<ProductInvoice> {
    return this.http.put<ProductInvoice>(`${PRODUCT_INVOICES_API_URL}/${productInvoice.id}`, productInvoice);
  }
}
