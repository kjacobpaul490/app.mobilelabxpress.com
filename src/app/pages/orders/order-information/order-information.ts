import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusBar } from '../status-bar/status-bar';

@Component({
  selector: 'app-order-information',
  imports: [CommonModule, FormsModule, StatusBar],
  templateUrl: './order-information.html',
  styleUrl: './order-information.css',
  standalone: true,
})
export class OrderInformation {
  private router = inject(Router);

  formData = {
    orderType: '',
    priority: '',
    requestedDate: '',
    specialInstructions: '',
    additionalTests: '',
  };

  isSubmitting = false;
  errorMessage = '';

  validateForm(): boolean {
    if (!this.formData.orderType.trim()) {
      this.errorMessage = 'Order type is required';
      return false;
    }
    if (!this.formData.priority.trim()) {
      this.errorMessage = 'Priority is required';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }
    this.isSubmitting = true;
    setTimeout(() => {
      this.router.navigate(['/layout/preview']);
    }, 1000);
  }

  onBack() {
    this.router.navigate(['/layout/insurance-information']);
  }

  onSkip() {
    this.router.navigate(['/layout/preview']);
  }
}
