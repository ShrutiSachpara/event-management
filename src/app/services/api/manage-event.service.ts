import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, take } from 'rxjs';
import { baseUrl } from './apiRoute';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/auth.reducer';
import { url } from './apiUrl';
import { AddEvent } from 'src/app/data-type';
import { selectAuthToken } from '../../auth/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class ManageEventService {
  constructor(private http: HttpClient, private store: Store) {}

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

  getEventData(): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.listOfEvent;
        return this.http.post(urls, {}, { headers });
      })
    );
  }

  insertEventManageData(eventData: { event_name: any }): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.addEvent;
        return this.http.post(urls, eventData, { headers });
      })
    );
  }

  updateEvent(id: number, eventData: AddEvent): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.editEvent + id;
        return this.http.put(urls, eventData, { headers });
      })
    );
  }

  deleteEvent(id: number): Observable<any> {
    return this.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.deleteEvent + id;
        let data = { is_deleted: true };
        return this.http.put(urls, data, { headers });
      })
    );
  }
}
