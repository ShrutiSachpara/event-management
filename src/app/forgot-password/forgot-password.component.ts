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
import { Response } from '../data-type';
import { ENUM } from 'src/helper/enum';
import { Messages } from 'src/helper/message';

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
      Validators.email,
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
  login = ENUM.LOGIN;
  emailMessage = Messages.EMAIL_INCORRECT;
  passMessage = Messages.INCORRECT_PASSWORD;
  validOtp = Messages.VALID_OTP;
  matchPass = Messages.MATCH_PASS;
  sendPasswordReset() {
    if (!this.showOtpInput && this.emailControl.valid) {
      this.loading = true;
      const email = this.emailControl.value!;
      this.forgotPasswordService
        .sendPasswordResetEmail(email)
        .subscribe((response: Response) => {
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
            this.router.navigate(['updatePassword']);
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

      if (newPassword !== confirmPassword) {
        this.showMessage(
          "Confirm Password doesn't match new password.",
          'dismiss'
        );
        this.loading = false;
        return;
      }

      this.forgotPasswordService
        .verifyOtpAndResetPassword(email, otp, newPassword, confirmPassword)
        .subscribe((response: Response) => {
          if (response.statusCode === HttpStatus.ACCEPTED) {
            this.showMessage(response.message, 'dismiss');
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
