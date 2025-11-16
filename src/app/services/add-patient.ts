import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Gender: string;
    Dob: string;
    MobileNumber: string;
    AlternativeMobileNumber: string;
    Email: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Zipcode: string;
    Country: string;
    Race: string;
    Ethnicity: string;
    IsHomeboundPatient: boolean;
    IsHardStick: boolean;
    PatientNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddPatientService {
  private apiUrl = '/api/patients/createPatient';

  constructor(private http: HttpClient) { }

  addPatient(patient: Patient): Observable<Patient> {
    // Format date to DD-MM-YYYY format
    const formattedPatient = {
      ...patient,
      Dob: this.formatDateForSqlServer(patient.Dob)
    };
    console.log('Sending patient data:', formattedPatient);
    return this.http.post<Patient>(this.apiUrl, formattedPatient);
  }

  private formatDateForSqlServer(dateString: string): string {
    if (!dateString) return '';
    
    try {
      // If input is in YYYY-MM-DD format (from HTML5 date input)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        // Convert to DD-MM-YYYY format
        const formattedDate = `${day}-${month}-${year}`;
        console.log('Formatted date:', dateString, '→', formattedDate);
        return formattedDate;
      }
      
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
}
