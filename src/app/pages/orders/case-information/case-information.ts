import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusBar } from '../status-bar/status-bar';

@Component({
  selector: 'app-case-information',
  imports: [CommonModule, FormsModule, StatusBar],
  templateUrl: './case-information.html',
  styleUrl: './case-information.css',
  standalone: true,
})
export class CaseInformation {
  private router = inject(Router);

  formData = {
    caseType: '',
    symptoms: '',
    diagnosis: '',
    notes: '',
    referralSource: '',
  };

  isSubmitting = false;
  errorMessage = '';

  validateForm(): boolean {
    if (!this.formData.caseType.trim()) {
      this.errorMessage = 'Case type is required';
      return false;
    }
    if (!this.formData.symptoms.trim()) {
      this.errorMessage = 'Symptoms are required';
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
      console.log('Case information saved:', this.formData);
      this.router.navigate(['/layout/insurance-information']);
    }, 1000);
  }

  onBack() {
    this.router.navigate(['/layout/create-new-order']);
  }

  onSkip() {
    this.router.navigate(['/layout/insurance-information']);
  }
}
