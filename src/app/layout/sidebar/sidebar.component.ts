import { Component } from '@angular/core';
import { MenuService } from 'src/app/services/menu-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  menuItems: { icon: string; title: string; route: string }[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems();
  }
}
