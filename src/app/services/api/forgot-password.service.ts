import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from './apiRoute';
import { url } from './apiUrl';
@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  constructor(private http: HttpClient) {}

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post<any>(baseUrl.basicUrl + url.verifyEmail, { email });
  }

  verifyOtpAndResetPassword(
    email: string,
    otp: number,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const verifyUrl = baseUrl.basicUrl + url.updatePassword;
    const requestBody = {
      email,
      otp,
      newPassword,
      confirmPassword,
    };

    return this.http.put(verifyUrl, requestBody);
  }
}
