import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-nav',
  imports: [CommonModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  profileMenuOpen = false;
  hasNotifications = true;
  notificationCount = 3;
  logoImage = 'assets/images/Mlx-logo-light.png';

  sampleUser = {
    name: 'John Doe',
    email: 'john.doe@mobilelabxpress.com',
    role: 'Administrator',
  };

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  logout() {
    this.closeProfileMenu();
    // Add logout logic here
    console.log('Logging out...');
  }

  viewNotifications() {
    // Add notification logic here
    console.log('Viewing notifications...');
  }
}
