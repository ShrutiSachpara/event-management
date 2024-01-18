  import { Component, Input } from '@angular/core';
  import { FormControl } from '@angular/forms';

  @Component({
    selector: 'app-base-input',
    templateUrl: './base-input.component.html',
    styleUrls: ['./base-input.component.css'],
  })
  export class BaseInputComponent {
    @Input() label: string = '';
    @Input() control!: FormControl;
    @Input() isEmail: boolean = false;
    @Input() inputType: string = 'text';
    @Input() errorMessage: string = '';
  }
