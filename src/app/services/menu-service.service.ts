import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  getMenuItems(): { icon: string; title: string; route: string }[] {
    return [
      { icon: 'bx bx-home-circle', title: 'Dashboard', route: 'dashboard' },
      { icon: 'bx bx-category', title: 'Category', route: 'category' },
      { icon: 'bx bx-cart', title: 'Manage Service', route: 'serviceManage' },
      { icon: 'bx bx-bar-chart-alt', title: 'Report', route: 'report' },
      { icon: 'bx bxs-key', title: 'Reset Password', route: 'changePassword' },
    ];
  }
}
