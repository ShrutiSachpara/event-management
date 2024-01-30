import { Injectable } from '@angular/core';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChangePassword } from 'src/app/data-type';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}
  changePassword(data: ChangePassword): Observable<any> {
    return this.headerService.getRequestHeaders().pipe(
      switchMap((headers) => {
        const requestBody = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        };

        return this.http.put(
          baseUrl.basicUrl + url.changePassword,
          requestBody,
          { headers }
        );
      })
    );
  }
}
