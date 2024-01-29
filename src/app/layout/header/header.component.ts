import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  menuItems = [
    { iconClass: 'bx bx-user', text: 'Profile' },
    { iconClass: 'bx bx-cog', text: 'Settings' },
    { iconClass: 'bx bx-log-out-circle', text: 'Logout' },
  ];
}
