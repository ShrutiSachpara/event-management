import { Injectable } from '@angular/core';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthState } from 'src/app/auth/auth.reducer';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { selectAuthToken } from '../../auth/auth.selector';
import { ChangePassword } from 'src/app/data-type';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  constructor(private http: HttpClient, private store: Store<AuthState>) {}

  changePassword(data: ChangePassword): Observable<any> {
    return this.store.pipe(
      select(selectAuthToken),
      take(1),
      switchMap((token) => {
        const reqHeader = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        });

        const requestBody = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        };

        return this.http.put(
          baseUrl.basicUrl + url.changePassword,
          requestBody,
          {
            headers: reqHeader,
          }
        );
      })
    );
  }
}
