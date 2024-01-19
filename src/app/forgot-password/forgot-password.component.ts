import { Component, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { ForgotPasswordService } from '../services/api/forgot-password.service';
import { Router } from '@angular/router';
import { HttpStatus } from 'src/helper/httpStatus';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  emailControl: FormControl<string | null>;
  otpControl: FormControl<string | null>;
  loading: boolean = false;
  forgotPasswordForm: FormGroup;
  showOtpInput = false;
  newPasswordControl: FormControl<string | null>;
  confirmPasswordControl: FormControl<string | null>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService,
    private forgotPasswordService: ForgotPasswordService
  ) {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]);

    this.otpControl = new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{6}'),
    ]);

    this.newPasswordControl = new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]);

    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]);

    this.forgotPasswordForm = this.fb.group({
      otp: this.otpControl,
      email: this.emailControl,
      newPassword: this.newPasswordControl,
      confirmPassword: this.confirmPasswordControl,
    });
  }

  sendPasswordReset() {
    if (!this.showOtpInput && this.emailControl.valid) {
      this.loading = true;
      const email = this.emailControl.value!;
      this.forgotPasswordService
        .sendPasswordResetEmail(email)
        .subscribe((response: any) => {
          this.showMessage(response.message, 'success');
          if (response.statusCode === HttpStatus.OK) {
            this.showOtpInput = true;
          } else {
            this.showMessage(response.message, 'dismiss');
          }
        })
        .add(() => {
          this.loading = false;
          if (this.showOtpInput) {
            this.router.navigate(['updatePassword'], {
              queryParams: { email },
            });
          }
        });
    }
  }

  verifyOtp() {
    if (this.showOtpInput && this.otpControl.valid) {
      this.loading = true;
      const email = this.emailControl.value!;
      const otp = +this.otpControl.value!;
      const newPassword = this.newPasswordControl.value!;
      const confirmPassword = this.confirmPasswordControl.value!;

      this.forgotPasswordService
        .verifyOtpAndResetPassword(email, otp, newPassword, confirmPassword)
        .subscribe((response: any) => {
          this.showMessage(response.message, 'success');
          if (response.statusCode === HttpStatus.ACCEPTED) {
            this.showMessage(response.message, 'success');
            this.router.navigate(['login']);
          } else {
            this.showMessage(response.message, 'dismiss');
          }
        })
        .add(() => {
          this.emailControl.reset();
          this.otpControl.reset();
          this.showOtpInput = false;
          this.loading = false;
        });
    }
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }
}
