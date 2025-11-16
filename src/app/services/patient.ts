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
    const formattedPatient = {
      ...patient,
      Dob: this.formatDateForSqlServer(patient.Dob)
    };
    return this.http.post<Patient>(this.apiUrl, formattedPatient);
  }

  private formatDateForSqlServer(dateString: string): string {
    if (!dateString) return '';
    
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
      }
      
      return dateString;
    } catch (error) {
      return dateString;
    }
  }
}
