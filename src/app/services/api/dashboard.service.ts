import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}

  getCountOfBookingStatus(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.countOfBookingStatus;
        return this.http.get(urls, { headers });
      })
    );
  }

  getLatestBookingData(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.listOfLatestBooking;
        return this.http.get(urls, { headers });
      })
    );
  }

  getGraphOfUser(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.graphOfUser;
        return this.http.post(urls, { type: 'Yearly' }, { headers });
      })
    );
  }
}
