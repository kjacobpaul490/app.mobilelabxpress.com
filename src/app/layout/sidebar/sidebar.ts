import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarOpen = true;
  activeMenu: string | null = null;
  activeSubmenu: string | null = null;

  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      route: '/layout/dashboard',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '📋',
      submenu: [
        {
          id: 'all',
          label: 'All',
          route: '/layout/manage-orders?filter=all',
        },
        {
          id: 'pending',
          label: 'Pending',
          route: '/layout/manage-orders?filter=pending',
        },
        {
          id: 'projects',
          label: 'Projects',
          route: '/layout/manage-orders?filter=projects',
        },
      ],
    },
    {
      id: 'facility',
      label: 'Facility',
      icon: '🏥',
      submenu: [
        {
          id: 'add-facility',
          label: 'Add Facility',
          route: '/layout/add-facility',
        },
      ],
    },
     {
      id: 'insurance',
      label: 'Insurance',
      icon: '📝',
      submenu: [
        {
          id: 'add-insurance',
          label: 'Add insurance',
          route: '/layout/add-insurance',
        },
         {
          id: 'list-insurance',
          label: 'insurance-list',
          route: '/layout/list-insurance',
        },
      ],
    },
  ];

  toggleMenu(menuId: string) {
    this.activeMenu = this.activeMenu === menuId ? null : menuId;
    this.activeSubmenu = null;
  }

  toggleSubmenu(submenuId: string) {
    this.activeSubmenu = this.activeSubmenu === submenuId ? null : submenuId;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
