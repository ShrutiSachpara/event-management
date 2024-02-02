import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { Observable, switchMap } from 'rxjs';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}

  getBookingReportData(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.bookingReport;
        return this.http.post(urls, {}, { headers });
      })
    );
  }

  getEventReportData(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.eventReport;
        return this.http.post(urls, {}, { headers });
      })
    );
  }
}
