import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facility {
  Name: string;
  MobileNumber: string;
  AlternativeMobileNumber: string;
  Email: string;
  FaxNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  State: string;
  Zipcode: string;
  Country: string;
  PrimaryInchargeName: string;
  PrimaryInchargeMobileNumber: string;
  PrimaryInchargeDesignation: string;
  IsActive: boolean;
  ResultCommunicationMethod: string;
}

@Injectable({
  providedIn: 'root'
})

export class AddFacilityService {
  private apiUrl = '/api/facilities/createFacility';
  private apiBaseUrl = '/api/facilities';

  constructor(private http: HttpClient) {}

  // Create a new facility
  createFacility(facility: Facility): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(this.apiUrl, facility, { headers });
  }

  // Get all facilities
  getAllFacilities(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllfacilities?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Delete facility by GUID
  deleteFacility(facilityGuid: string): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/deleteFacilityByGuid/${facilityGuid}`);
  }

  // Validate facility data
  validateFacility(facility: Facility): { isValid: boolean; errors: any } {
    const errors: any = {};
    let isValid = true;

    // Name validation (varchar(250))
    if (!facility.Name || facility.Name.trim().length < 3) {
      errors.Name = 'Facility name must be at least 3 characters';
      isValid = false;
    } else if (facility.Name.length > 250) {
      errors.Name = 'Facility name cannot exceed 250 characters';
      isValid = false;
    }

    // Mobile Number validation (varchar(20))
    if (!facility.MobileNumber || facility.MobileNumber.trim().length === 0) {
      errors.MobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (facility.MobileNumber.length > 20) {
      errors.MobileNumber = 'Mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Alternative Mobile Number validation (varchar(20)) - optional
    if (facility.AlternativeMobileNumber && facility.AlternativeMobileNumber.length > 20) {
      errors.AlternativeMobileNumber = 'Alternative mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Email validation (varchar(500))
    if (!facility.Email || !this.isValidEmail(facility.Email)) {
      errors.Email = 'Please enter a valid email address';
      isValid = false;
    } else if (facility.Email.length > 500) {
      errors.Email = 'Email cannot exceed 500 characters';
      isValid = false;
    }

    // Fax Number validation (varchar(20)) - optional
    if (facility.FaxNumber && facility.FaxNumber.length > 20) {
      errors.FaxNumber = 'Fax number cannot exceed 20 characters';
      isValid = false;
    }

    // Address Line 1 validation (varchar(500))
    if (!facility.AddressLine1 || facility.AddressLine1.trim().length < 5) {
      errors.AddressLine1 = 'Address must be at least 5 characters';
      isValid = false;
    } else if (facility.AddressLine1.length > 500) {
      errors.AddressLine1 = 'Address Line 1 cannot exceed 500 characters';
      isValid = false;
    }

    // Address Line 2 validation (varchar(500)) - optional
    if (facility.AddressLine2 && facility.AddressLine2.length > 500) {
      errors.AddressLine2 = 'Address Line 2 cannot exceed 500 characters';
      isValid = false;
    }

    // City validation (varchar(250))
    if (!facility.City || facility.City.trim().length < 2) {
      errors.City = 'City name must be at least 2 characters';
      isValid = false;
    } else if (facility.City.length > 250) {
      errors.City = 'City name cannot exceed 250 characters';
      isValid = false;
    }

    // State validation (varchar(250))
    if (!facility.State || facility.State.trim().length < 2) {
      errors.State = 'State name must be at least 2 characters';
      isValid = false;
    } else if (facility.State.length > 250) {
      errors.State = 'State name cannot exceed 250 characters';
      isValid = false;
    }

    // Zipcode validation (varchar(50))
    if (!facility.Zipcode || facility.Zipcode.trim().length === 0) {
      errors.Zipcode = 'Zipcode is required';
      isValid = false;
    } else if (facility.Zipcode.length > 50) {
      errors.Zipcode = 'Zipcode cannot exceed 50 characters';
      isValid = false;
    }

    // Country validation (varchar(250))
    if (!facility.Country || facility.Country.trim().length < 2) {
      errors.Country = 'Country name must be at least 2 characters';
      isValid = false;
    } else if (facility.Country.length > 250) {
      errors.Country = 'Country name cannot exceed 250 characters';
      isValid = false;
    }

    // Primary Incharge Name validation (varchar(250))
    if (!facility.PrimaryInchargeName || facility.PrimaryInchargeName.trim().length < 3) {
      errors.PrimaryInchargeName = 'Primary incharge name must be at least 3 characters';
      isValid = false;
    } else if (facility.PrimaryInchargeName.length > 250) {
      errors.PrimaryInchargeName = 'Primary incharge name cannot exceed 250 characters';
      isValid = false;
    }

    // Primary Incharge Mobile Number validation (varchar(20))
    if (!facility.PrimaryInchargeMobileNumber || facility.PrimaryInchargeMobileNumber.trim().length === 0) {
      errors.PrimaryInchargeMobileNumber = 'Primary incharge mobile number is required';
      isValid = false;
    } else if (facility.PrimaryInchargeMobileNumber.length > 20) {
      errors.PrimaryInchargeMobileNumber = 'Mobile number cannot exceed 20 characters';
      isValid = false;
    }

    // Primary Incharge Designation validation (varchar(250)) - optional
    if (facility.PrimaryInchargeDesignation && facility.PrimaryInchargeDesignation.trim().length < 2) {
      errors.PrimaryInchargeDesignation = 'Designation must be at least 2 characters';
      isValid = false;
    } else if (facility.PrimaryInchargeDesignation && facility.PrimaryInchargeDesignation.length > 250) {
      errors.PrimaryInchargeDesignation = 'Designation cannot exceed 250 characters';
      isValid = false;
    }

    // Result Communication Method validation (varchar(250))
    if (!facility.ResultCommunicationMethod) {
      errors.ResultCommunicationMethod = 'Please select a communication method';
      isValid = false;
    } else if (facility.ResultCommunicationMethod.length > 250) {
      errors.ResultCommunicationMethod = 'Communication method cannot exceed 250 characters';
      isValid = false;
    }

    return { isValid, errors };
  }

  // Helper method to validate email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
