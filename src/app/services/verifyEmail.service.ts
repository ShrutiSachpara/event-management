import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from './api/apiRoute';
import { url } from './api/apiUrl'; 

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(baseUrl.basicUrl + url.verifyEmail, data);
  }
}