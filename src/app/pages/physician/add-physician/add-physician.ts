import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PhysicianService, Physician as PhysicianModel } from '../../../services/physician';

@Component({
  selector: 'app-add-physician',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-physician.html',
  styleUrl: './add-physician.css',
})
export class AddPhysician {
  physician: PhysicianModel = {
    Npi: null,
    Name: '',
    PhoneNumber: '',
    AlternativePhoneNumber: '',
    EnumerationDate: '',
    NpiType: '',
    IsSoleProprietor: false,
    IsActive: true,
    MailingAddress: '',
    PrimaryPracticeAddress: '',
    SecondaryPracticeAddress: ''
  };

  validationErrors: any = {};
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private physicianService: PhysicianService) {}

  onSubmit() {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      this.physicianService.createPhysician(this.physician).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = error.error?.message || 'Failed to create physician. Please try again.';
        }
      });
    }
  }

  resetForm() {
    this.physician = {
      Npi: null,
      Name: '',
      PhoneNumber: '',
      AlternativePhoneNumber: '',
      EnumerationDate: '',
      NpiType: '',
      IsSoleProprietor: false,
      IsActive: true,
      MailingAddress: '',
      PrimaryPracticeAddress: '',
      SecondaryPracticeAddress: ''
    };
    this.validationErrors = {};
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    debugger;

    // NPI validation (int)
    if (this.physician.Npi && (this.physician.Npi <= 0 || !Number.isInteger(this.physician.Npi))) {
      this.validationErrors.Npi = 'NPI must be a valid positive integer';
      isValid = false;
    }

    // Name validation (varchar(250))
    if (!this.physician.Name || this.physician.Name.trim().length < 3) {
      this.validationErrors.Name = 'Physician name must be at least 3 characters';
      isValid = false;
    } else if (this.physician.Name.length > 250) {
      this.validationErrors.Name = 'Physician name cannot exceed 250 characters';
      isValid = false;
    }

    // Phone Number validation (varchar(20))
    if (!this.physician.PhoneNumber || this.physician.PhoneNumber.trim().length === 0) {
      this.validationErrors.PhoneNumber = 'Phone number is required';
      isValid = false;
    } else if (this.physician.PhoneNumber.length > 20) {
      this.validationErrors.PhoneNumber = 'Phone number cannot exceed 20 characters';
      isValid = false;
    }

    // Alternative Phone Number validation (varchar(20)) - optional
    if (this.physician.AlternativePhoneNumber && this.physician.AlternativePhoneNumber.length > 20) {
      this.validationErrors.AlternativePhoneNumber = 'Alternative phone number cannot exceed 20 characters';
      isValid = false;
    }

    // Enumeration Date validation (date)
    if (!this.physician.EnumerationDate) {
      this.validationErrors.EnumerationDate = 'Enumeration date is required';
      isValid = false;
    }

    // NPI Type validation (varchar(50))
    if (!this.physician.NpiType || this.physician.NpiType.trim().length === 0) {
      this.validationErrors.NpiType = 'NPI type is required';
      isValid = false;
    } else if (this.physician.NpiType.length > 50) {
      this.validationErrors.NpiType = 'NPI type cannot exceed 50 characters';
      isValid = false;
    }

    // Mailing Address validation (varchar(500))
    if (!this.physician.MailingAddress || this.physician.MailingAddress.trim().length < 5) {
      this.validationErrors.MailingAddress = 'Mailing address must be at least 5 characters';
      isValid = false;
    } else if (this.physician.MailingAddress.length > 500) {
      this.validationErrors.MailingAddress = 'Mailing address cannot exceed 500 characters';
      isValid = false;
    }

    // Primary Practice Address validation (varchar(500))
    if (!this.physician.PrimaryPracticeAddress || this.physician.PrimaryPracticeAddress.trim().length < 5) {
      this.validationErrors.PrimaryPracticeAddress = 'Primary practice address must be at least 5 characters';
      isValid = false;
    } else if (this.physician.PrimaryPracticeAddress.length > 500) {
      this.validationErrors.PrimaryPracticeAddress = 'Primary practice address cannot exceed 500 characters';
      isValid = false;
    }

    // Secondary Practice Address validation (varchar(500)) - optional
    if (this.physician.SecondaryPracticeAddress && this.physician.SecondaryPracticeAddress.length > 500) {
      this.validationErrors.SecondaryPracticeAddress = 'Secondary practice address cannot exceed 500 characters';
      isValid = false;
    }

    return isValid;
  }

  clearError(field: string) {
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
    }
  }
}
