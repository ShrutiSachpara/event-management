import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, take } from 'rxjs';
import { baseUrl } from './apiRoute';
import { Store, select } from '@ngrx/store';

import { AuthState } from 'src/app/auth/auth.reducer';
import { selectAuthToken } from '../../auth/auth.selector';
import { url } from './apiUrl';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private store: Store<AuthState>) {}

  private getRequestHeaders(): Observable<HttpHeaders> {
    return this.store.pipe(
      select(selectAuthToken),
      take(1),
      switchMap((token) => {
        const reqHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        });
        return of(reqHeaders);
      })
    );
  }

  getCountOfBookingStatus(): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.countOfBookingStatus;
        return this.http.get(urls, { headers });
      })
    );
  }

  getLatestBookingData(): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.listOfLatestBooking;
        return this.http.get(urls, { headers });
      })
    );
  }

  getGraphOfUser(): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.graphOfUser;
        return this.http.post(urls, { type: 'Yearly' }, { headers });
      })
    );
  }
}
