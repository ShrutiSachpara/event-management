import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-button',
  templateUrl: './base-button.component.html',
  styleUrls: ['./base-button.component.css'],
})
export class BaseButtonComponent {
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}
