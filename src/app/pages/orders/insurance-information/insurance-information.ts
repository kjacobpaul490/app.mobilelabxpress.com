import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusBar } from '../status-bar/status-bar';

@Component({
  selector: 'app-insurance-information',
  imports: [CommonModule, FormsModule, StatusBar],
  templateUrl: './insurance-information.html',
  styleUrl: './insurance-information.css',
  standalone: true,
})
export class InsuranceInformation {
  private router = inject(Router);

  formData = {
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    copay: '',
    deductible: '',
  };

  isSubmitting = false;
  errorMessage = '';

  validateForm(): boolean {
    if (!this.formData.insuranceProvider.trim()) {
      this.errorMessage = 'Insurance provider is required';
      return false;
    }
    if (!this.formData.policyNumber.trim()) {
      this.errorMessage = 'Policy number is required';
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
      this.router.navigate(['/layout/order-information']);
    }, 1000);
  }

  onBack() {
    this.router.navigate(['/layout/case-information']);
  }

  onSkip() {
    this.router.navigate(['/layout/order-information']);
  }
}
