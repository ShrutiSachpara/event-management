import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';
import { ChangePasswordService } from '../services/api/changePassword.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  loading: boolean = false;

  oldPasswordControl: FormControl<string | null>;
  newPasswordControl: FormControl<string | null>;
  confirmPasswordControl: FormControl<string | null>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private toasterservice: ToasterService
  ) {
    this.oldPasswordControl = new FormControl('', [Validators.required]);
    this.newPasswordControl = new FormControl('', [Validators.required]);
    this.confirmPasswordControl = new FormControl('', [Validators.required]);
    this.changePasswordForm = this.fb.group({
      currentPassword: this.oldPasswordControl,
      newPassword: this.newPasswordControl,
      confirmPassword: this.confirmPasswordControl,
    });
  }

  onSubmit(data: any) {
    if (this.changePasswordForm.valid) {
      this.changePasswordService
        .changePassword(data)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.showMessage(response.message, 'success');
            this.router.navigate(['/dashboard']);
          } else {
            this.showMessage(response.message, 'dismiss');
          }
        });
    }
  }

  showMessage(message: string, action: string) {
    this.toasterservice.showMessage(message, action);
  }
}
