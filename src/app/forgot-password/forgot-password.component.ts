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
import { Messages } from 'src/helper/message';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  otpControl = new FormControl('', [Validators.required]);
  loading: boolean = false;
  forgotPasswordForm: FormGroup;
  showOtpInput = false;
  emailIncorrect = Messages.EMAIL_INCORRECT;
  validOtp = Messages.VALID_OTP;

  newPasswordControl = new FormControl('', [Validators.required]);
  confirmPasswordControl = new FormControl('', [Validators.required]);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService,
    private forgotPasswordService: ForgotPasswordService
  ) {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
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
            this.router.navigate(['/forgot-password'], {
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
          if (response.statusCode === HttpStatus.OK) {
            this.showMessage(response.message, 'success');
            this.router.navigate(['/login']);
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
