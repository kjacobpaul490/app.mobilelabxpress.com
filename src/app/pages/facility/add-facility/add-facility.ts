import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddFacilityService, Facility } from '../../../services/facility';

@Component({
  selector: 'app-add-facility',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-facility.html',
  styleUrl: './add-facility.css'
})
export class AddFacility {
  facility: Facility = {
    Name: '',
    MobileNumber: '',
    AlternativeMobileNumber: '',
    Email: '',
    FaxNumber: '',
    AddressLine1: '',
    AddressLine2: '',
    City: '',
    State: '',
    Zipcode: '',
    Country: '',
    PrimaryInchargeName: '',
    PrimaryInchargeMobileNumber: '',
    PrimaryInchargeDesignation: '',
    IsActive: true,
    ResultCommunicationMethod: ''
  };

  validationErrors: any = {};
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private facilityService: AddFacilityService) {}

  onSubmit() {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      this.facilityService.createFacility(this.facility).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
          // Handle success - you can add navigation or success message here
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = error.error?.message || 'Failed to create facility. Please try again.';
          // Handle error
        }
      });
    }
  }

  resetForm() {
    this.facility = {
      Name: '',
      MobileNumber: '',
      AlternativeMobileNumber: '',
      Email: '',
      FaxNumber: '',
      AddressLine1: '',
      AddressLine2: '',
      City: '',
      State: '',
      Zipcode: '',
      Country: '',
      PrimaryInchargeName: '',
      PrimaryInchargeMobileNumber: '',
      PrimaryInchargeDesignation: '',
      IsActive: true,
      ResultCommunicationMethod: ''
    };
    this.validationErrors = {};
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Name validation (varchar(250))
    if (!this.facility.Name || this.facility.Name.trim().length < 3) {
      this.validationErrors.Name = 'Facility name must be at least 3 characters';
      isValid = false;
    } else if (this.facility.Name.length > 250) {
      this.validationErrors.Name = 'Facility name cannot exceed 250 characters';
      isValid = false;
    }

    // Mobile Number validation (varchar(20))
    if (!this.facility.MobileNumber || this.facility.MobileNumber.trim().length === 0) {
      this.validationErrors.MobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (this.facility.MobileNumber.length > 20) {
      this.validationErrors.MobileNumber = 'Mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Alternative Mobile Number validation (varchar(20)) - optional
    if (this.facility.AlternativeMobileNumber && this.facility.AlternativeMobileNumber.length > 20) {
      this.validationErrors.AlternativeMobileNumber = 'Alternative mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Email validation (varchar(500))
    if (!this.facility.Email || !this.isValidEmail(this.facility.Email)) {
      this.validationErrors.Email = 'Please enter a valid email address';
      isValid = false;
    } else if (this.facility.Email.length > 500) {
      this.validationErrors.Email = 'Email cannot exceed 500 characters';
      isValid = false;
    }

    // Fax Number validation (varchar(20)) - optional
    if (this.facility.FaxNumber && this.facility.FaxNumber.length > 20) {
      this.validationErrors.FaxNumber = 'Fax number cannot exceed 20 characters';
      isValid = false;
    }

    // Address Line 1 validation (varchar(500))
    if (!this.facility.AddressLine1 || this.facility.AddressLine1.trim().length < 5) {
      this.validationErrors.AddressLine1 = 'Address must be at least 5 characters';
      isValid = false;
    } else if (this.facility.AddressLine1.length > 500) {
      this.validationErrors.AddressLine1 = 'Address Line 1 cannot exceed 500 characters';
      isValid = false;
    }

    // Address Line 2 validation (varchar(500)) - optional
    if (this.facility.AddressLine2 && this.facility.AddressLine2.length > 500) {
      this.validationErrors.AddressLine2 = 'Address Line 2 cannot exceed 500 characters';
      isValid = false;
    }

    // City validation (varchar(250))
    if (!this.facility.City || this.facility.City.trim().length < 2) {
      this.validationErrors.City = 'City name must be at least 2 characters';
      isValid = false;
    } else if (this.facility.City.length > 250) {
      this.validationErrors.City = 'City name cannot exceed 250 characters';
      isValid = false;
    }

    // State validation (varchar(250))
    if (!this.facility.State || this.facility.State.trim().length < 2) {
      this.validationErrors.State = 'State name must be at least 2 characters';
      isValid = false;
    } else if (this.facility.State.length > 250) {
      this.validationErrors.State = 'State name cannot exceed 250 characters';
      isValid = false;
    }

    // Zipcode validation (varchar(50))
    if (!this.facility.Zipcode || this.facility.Zipcode.trim().length === 0) {
      this.validationErrors.Zipcode = 'Zipcode is required';
      isValid = false;
    } else if (this.facility.Zipcode.length > 50) {
      this.validationErrors.Zipcode = 'Zipcode cannot exceed 50 characters';
      isValid = false;
    }

    // Country validation (varchar(250))
    if (!this.facility.Country || this.facility.Country.trim().length < 2) {
      this.validationErrors.Country = 'Country name must be at least 2 characters';
      isValid = false;
    } else if (this.facility.Country.length > 250) {
      this.validationErrors.Country = 'Country name cannot exceed 250 characters';
      isValid = false;
    }

    // Primary Incharge Name validation (varchar(250))
    if (!this.facility.PrimaryInchargeName || this.facility.PrimaryInchargeName.trim().length < 3) {
      this.validationErrors.PrimaryInchargeName = 'Primary incharge name must be at least 3 characters';
      isValid = false;
    } else if (this.facility.PrimaryInchargeName.length > 250) {
      this.validationErrors.PrimaryInchargeName = 'Primary incharge name cannot exceed 250 characters';
      isValid = false;
    }

    // Primary Incharge Mobile Number validation (varchar(20))
    if (!this.facility.PrimaryInchargeMobileNumber || this.facility.PrimaryInchargeMobileNumber.trim().length === 0) {
      this.validationErrors.PrimaryInchargeMobileNumber = 'Primary incharge mobile number is required';
      isValid = false;
    } else if (this.facility.PrimaryInchargeMobileNumber.length > 20) {
      this.validationErrors.PrimaryInchargeMobileNumber = 'Mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Primary Incharge Designation validation (varchar(250)) - optional
    if (this.facility.PrimaryInchargeDesignation && this.facility.PrimaryInchargeDesignation.trim().length < 2) {
      this.validationErrors.PrimaryInchargeDesignation = 'Designation must be at least 2 characters';
      isValid = false;
    } else if (this.facility.PrimaryInchargeDesignation && this.facility.PrimaryInchargeDesignation.length > 250) {
      this.validationErrors.PrimaryInchargeDesignation = 'Designation cannot exceed 250 characters';
      isValid = false;
    }

    // Result Communication Method validation (varchar(250))
    if (!this.facility.ResultCommunicationMethod) {
      this.validationErrors.ResultCommunicationMethod = 'Please select a communication method';
      isValid = false;
    } else if (this.facility.ResultCommunicationMethod.length > 250) {
      this.validationErrors.ResultCommunicationMethod = 'Communication method cannot exceed 250 characters';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearError(field: string) {
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
    }
  }
}
