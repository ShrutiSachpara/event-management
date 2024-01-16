import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  otpControl = new FormControl('', [Validators.required]);
  loading: boolean = false;
  resetForm!: FormGroup;
  showOtpInput = false;

  newPasswordControl = new FormControl('', [Validators.required]);
  confirmPasswordControl = new FormControl('', [Validators.required]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {}

  sendPasswordReset() {
    if (!this.showOtpInput && this.emailControl.valid) {
      this.loading = true;
      const email = this.emailControl.value!;
      this.authService
        .sendPasswordResetEmail(email)
        .subscribe(
          (response: any) => {
            this.showMessage(response.message, 'success');
            if (response.statusCode === 200) {
              this.showOtpInput = true;
            }
          },
          (error: any) => {
            this.showMessage(error, 'error');
          }
        )
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

      this.authService
        .verifyOtpAndResetPassword(email, otp, newPassword, confirmPassword)
        .subscribe(
          (response: any) => {
            this.showMessage(response.message, 'success');
            if (response.statusCode === 200) {
              this.showMessage(response.message, 'success');
              this.router.navigate(['/login']);
            }
          },
          (error: any) => {
            this.showMessage(
              'Error verifying OTP and resetting password. Please try again.',
              error
            );
          }
        )
        .add(() => {
          this.emailControl.reset();
          this.otpControl.reset();
          this.showOtpInput = false;
          this.loading = false;
        });
    }
  }

  resetPassword() {
    const email = this.route.snapshot.queryParams['email'];

    if (this.newPasswordControl.valid && this.confirmPasswordControl.valid) {
      if (this.newPasswordControl.value === this.confirmPasswordControl.value) {
        this.loading = true;

        const newPassword: string = this.newPasswordControl.value as string;

        this.authService
          .resetPassword(email, newPassword)
          .subscribe(
            (response: any) => {
              this.showMessage(response.message, 'success');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 500);
            },
            (error: any) => {
              this.showMessage(
                'Error resetting password. Please try again.',
                error
              );
            }
          )
          .add(() => {
            this.loading = false;
          });
      } else {
        this.showMessage(
          'Passwords do not match. Please enter matching passwords.',
          'error'
        );
      }
    } else {
      this.showMessage(
        'Form is invalid. Please fill in all required fields.',
        'error'
      );
    }
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }
}
