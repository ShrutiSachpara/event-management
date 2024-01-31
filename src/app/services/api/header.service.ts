import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { selectAuthToken } from '../../auth/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private store: Store) {}

  getRequestHeaders(): Observable<HttpHeaders> {
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
}
