import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.action';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../services/api/apiRoute';
import { url } from '../services/api/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;

  constructor(private store: Store<AuthState>, private http: HttpClient) {}

  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
    this.store.dispatch(AuthActions.setLoggedIn({ isLoggedIn: value }));
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getRole(): string | null {
    return this.userRole;
  }

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

  resetPassword(email: string, newPassword: string): Observable<any> {
    const resetPasswordUrl = baseUrl.basicUrl + url.updatePassword;
    return this.http.put(resetPasswordUrl, { email, newPassword });
  }
}
