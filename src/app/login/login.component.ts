import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  // Create a FormGroup for the form controls
  constructor(private fb: FormBuilder) {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordControl = new FormControl('', [Validators.required]);

    this.loginForm = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });
  }

  // Function to handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}
