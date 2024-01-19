import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/api/login.service';
import { Login } from '../data-type';
import { AuthService } from '../auth/auth.service';
import { AuthState } from '../auth/auth.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/auth.action';
import { ToasterService } from '../services/toaster.service';
import { HttpStatus } from 'src/helper/httpStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm: FormGroup;
  public loading: boolean = false;
  emailControl: FormControl<string | null>;
  passwordControl: FormControl<string | null>;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private store: Store<AuthState>,
    private toasterservice: ToasterService,
    public router: Router
  ) {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]);
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]);

    this.loginForm = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });
  }

  showMessage(message: string, action: string) {
    this.toasterservice.showMessage(message, action);
  }

  onSubmit(data: Login) {
    this.loading = true;
    if (this.loginForm.valid) {
      this.loading = true;

      this.loginService
        .login(data)
        .subscribe((response: any) => {
          if (response.statusCode === HttpStatus.OK) {
            this.showMessage(response.message, 'dismiss');
            const token = response.data;
            this.store.dispatch(AuthActions.setToken({ token }));
            this.authService.setLoggedIn(true);
            this.router.navigate(['/changePassword']);
          } else {
            this.showMessage(response.message, 'Error');
          }
        })
        .add(() => {
          this.loading = false;
        });
    }
  }
}
