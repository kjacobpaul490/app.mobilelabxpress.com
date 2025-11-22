import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Physician {
  Guid: null | string;
  Npi: number | null;
  Name: string;
  PhoneNumber: string;
  AlternativePhoneNumber: string;
  EnumerationDate: string;
  NpiType: string;
  IsSoleProprietor: boolean;
  IsActive: boolean;
  MailingAddress: string;
  PrimaryPracticeAddress: string;
  SecondaryPracticeAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicianService {
  private apiUrl = '/api/physicians/createPhysician';
  private apiBaseUrl = '/api/physicians';

  constructor(private http: HttpClient) {}

  // Create a new physician
  createPhysician(physician: Physician): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(this.apiUrl, physician, { headers });
  }

  // Get all physicians with pagination
  getAllPhysicians(pageNumber: number, pageSize: number): Observable<any> {
    // Using query parameters format: ?pageNumber=1&pageSize=20
    return this.http.get<any>(`${this.apiBaseUrl}/getAllphysicians?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Get physician by ID


  // Get physician by GUID
  getPhysicianByGuid(guid: string): Observable<Physician> {
    return this.http.get<Physician>(`${this.apiBaseUrl}/getPhysicianByGuid/${guid}`);
  }

  // Update physician
  updatePhysician(id: number, physician: Physician): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<any>(`/api/physicians/${id}`, physician, { headers });
  }

  // Delete physician
  deletePhysician(id: number): Observable<any> {
    return this.http.delete<any>(`/api/physicians/${id}`);
  }

  // Validate physician data
  validatePhysician(physician: Physician): { isValid: boolean; errors: any } {
    const errors: any = {};
    let isValid = true;

    // NPI validation (int)
    if (physician.Npi && (physician.Npi <= 0 || !Number.isInteger(physician.Npi))) {
      errors.Npi = 'NPI must be a valid positive integer';
      isValid = false;
    }

    // Name validation (varchar(250))
    if (!physician.Name || physician.Name.trim().length < 3) {
      errors.Name = 'Physician name must be at least 3 characters';
      isValid = false;
    } else if (physician.Name.length > 250) {
      errors.Name = 'Physician name cannot exceed 250 characters';
      isValid = false;
    }

    // Phone Number validation (varchar(20))
    if (!physician.PhoneNumber || physician.PhoneNumber.trim().length === 0) {
      errors.PhoneNumber = 'Phone number is required';
      isValid = false;
    } else if (physician.PhoneNumber.length > 20) {
      errors.PhoneNumber = 'Phone number cannot exceed 20 characters';
      isValid = false;
    }

    // Alternative Phone Number validation (varchar(20)) - optional
    if (physician.AlternativePhoneNumber && physician.AlternativePhoneNumber.length > 20) {
      errors.AlternativePhoneNumber = 'Alternative phone number cannot exceed 20 characters';
      isValid = false;
    }

    // Enumeration Date validation (date)
    if (!physician.EnumerationDate) {
      errors.EnumerationDate = 'Enumeration date is required';
      isValid = false;
    }

    // NPI Type validation (varchar(50))
    if (!physician.NpiType || physician.NpiType.trim().length === 0) {
      errors.NpiType = 'NPI type is required';
      isValid = false;
    } else if (physician.NpiType.length > 50) {
      errors.NpiType = 'NPI type cannot exceed 50 characters';
      isValid = false;
    }

    // Mailing Address validation (varchar(500))
    if (!physician.MailingAddress || physician.MailingAddress.trim().length < 5) {
      errors.MailingAddress = 'Mailing address must be at least 5 characters';
      isValid = false;
    } else if (physician.MailingAddress.length > 500) {
      errors.MailingAddress = 'Mailing address cannot exceed 500 characters';
      isValid = false;
    }

    // Primary Practice Address validation (varchar(500))
    if (!physician.PrimaryPracticeAddress || physician.PrimaryPracticeAddress.trim().length < 5) {
      errors.PrimaryPracticeAddress = 'Primary practice address must be at least 5 characters';
      isValid = false;
    } else if (physician.PrimaryPracticeAddress.length > 500) {
      errors.PrimaryPracticeAddress = 'Primary practice address cannot exceed 500 characters';
      isValid = false;
    }

    // Secondary Practice Address validation (varchar(500)) - optional
    if (physician.SecondaryPracticeAddress && physician.SecondaryPracticeAddress.length > 500) {
      errors.SecondaryPracticeAddress = 'Secondary practice address cannot exceed 500 characters';
      isValid = false;
    }

    return { isValid, errors };
  }
}
