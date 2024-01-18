import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../data-type';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(data: Login) {
    return this.http.post(baseUrl.basicUrl + url.logInUrl, data);
  }
}
