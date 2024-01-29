import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
import { ServiceManage } from 'src/app/data-type';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceManageService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}

  getEventData(): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.viewService;
        return this.http.post(urls, {}, { headers });
      })
    );
  }

  insertEventManageData(eventData: ServiceManage): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.addService;
        return this.http.post(urls, eventData, { headers });
      })
    );
  }

  updateEvent(id: number, eventData: ServiceManage): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.updateService + id;
        return this.http.put(urls, eventData, { headers });
      })
    );
  }

  deleteEvent(id: number): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const urls = baseUrl.basicUrl + url.deleteService + id;
        let data = { is_deleted: true };
        return this.http.put(urls, data, { headers });
      })
    );
  }
}
