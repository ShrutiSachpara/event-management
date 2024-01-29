import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
import { AddEvent } from 'src/app/data-type';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class ManageEventService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}

  getEventData(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.listOfEvent;
        return this.http.post(urls, {}, { headers });
      })
    );
  }

  insertEventManageData(eventData: { event_name: any }): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.addEvent;
        return this.http.post(urls, eventData, { headers });
      })
    );
  }

  updateEvent(id: number, eventData: AddEvent): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.editEvent + id;
        return this.http.put(urls, eventData, { headers });
      })
    );
  }

  deleteEvent(id: number): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.deleteEvent + id;
        let data = { is_deleted: true };
        return this.http.put(urls, data, { headers });
      })
    );
  }
}
