import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  sidebarOpen = true;
  activeMenu: string | null = null;
  activeSubmenu: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Open the menu automatically based on current route
    this.updateActiveMenu(this.router.url);
    
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveMenu(event.url);
      });
  }

  updateActiveMenu(url: string) {
    // Find which menu contains this route
    for (const item of this.menuItems) {
      if (item.submenu) {
        const hasActiveRoute = item.submenu.some(sub => url.includes(sub.route));
        if (hasActiveRoute) {
          this.activeMenu = item.id;
          break;
        }
      }
    }
  }

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
          id: 'facilities',
          label: 'Facilities',
          route: '/layout/facilities',
        },
        {
          id: 'add-facility',
          label: 'Add Facility',
          route: '/layout/add-facility',
        },
      ],
    },
    {
      id: 'physician',
      label: 'Physician',
      icon: '👨‍⚕️',
      submenu: [
        {
          id: 'physicians',
          label: 'Physicians',
          route: '/layout/physicians',
        },
        {
          id: 'add-physician',
          label: 'Add Physician',
          route: '/layout/add-physician',
        },
      ],
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: '🧑‍🤝‍🧑',
      submenu: [
        {
          id: 'add-patient',
          label: 'Add Patient',
          route: '/layout/add-patient',
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
