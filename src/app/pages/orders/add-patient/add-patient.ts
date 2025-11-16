import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddPatientService } from '../../../services/patient';

@Component({
  selector: 'app-add-patient',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
  standalone: true,
})
export class AddPatient {
  private router = inject(Router);
  private patientService = inject(AddPatientService);

  // Form data - using camelCase for template binding
  formData = {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    phone: '',
    alternativePhone: '',
    email: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    race: '',
    ethnicity: '',
    isHomeboundPatient: false,
    isHardStick: false,
    patientNotes: '',
  };

  // Form state
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone format
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  // Validate form
  validateForm(): boolean {
    if (!this.formData.firstName.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }
    if (!this.formData.lastName.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }
    if (!this.formData.dob) {
      this.errorMessage = 'Date of birth is required';
      return false;
    }
    if (!this.formData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }
    if (!this.isValidEmail(this.formData.email)) {
      this.errorMessage = 'Invalid email format';
      return false;
    }
    if (!this.formData.phone.trim()) {
      this.errorMessage = 'Phone number is required';
      return false;
    }
    if (!this.isValidPhone(this.formData.phone)) {
      this.errorMessage = 'Invalid phone number format';
      return false;
    }
    if (!this.formData.address.trim()) {
      this.errorMessage = 'Address is required';
      return false;
    }
    if (!this.formData.city.trim()) {
      this.errorMessage = 'City is required';
      return false;
    }
    if (!this.formData.state.trim()) {
      this.errorMessage = 'State is required';
      return false;
    }
    if (!this.formData.zip.trim()) {
      this.errorMessage = 'Zip code is required';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  // Convert camelCase to PascalCase for backend
  private convertToPascalCase(data: any) {
    return {
      FirstName: data.firstName,
      MiddleName: data.middleName,
      LastName: data.lastName,
      Gender: data.gender,
      Dob: data.dob,
      MobileNumber: data.phone,
      AlternativeMobileNumber: data.alternativePhone,
      Email: data.email,
      AddressLine1: data.address,
      AddressLine2: data.addressLine2,
      City: data.city,
      State: data.state,
      Zipcode: data.zip,
      Country: data.country,
      Race: data.race,
      Ethnicity: data.ethnicity,
      IsHomeboundPatient: data.isHomeboundPatient,
      IsHardStick: data.isHardStick,
      PatientNotes: data.patientNotes,
    };
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const patientData = this.convertToPascalCase(this.formData);
    
    this.patientService.addPatient(patientData as any).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;

        setTimeout(() => {
          this.router.navigate(['/layout/create-new-order']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to add patient. Please try again.';
      }
    });
  }

  // Reset form
  onReset() {
    this.formData = {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dob: '',
      phone: '',
      alternativePhone: '',
      email: '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      race: '',
      ethnicity: '',
      isHomeboundPatient: false,
      isHardStick: false,
      patientNotes: '',
    };
    this.errorMessage = '';
    this.showSuccessMessage = false;
  }

  // Go back
  goBack() {
    this.router.navigate(['/layout/create-new-order']);
  }
}