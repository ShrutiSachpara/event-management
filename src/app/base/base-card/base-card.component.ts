import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  templateUrl: './base-card.component.html',
  styleUrls: ['./base-card.component.css'],
})
export class BaseCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() cardClass: string = '';
  @Input() valueClass: string = '';
  @Input() iconClass: string = '';
}
