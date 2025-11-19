import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientDirectoryService {
  private readonly apiBaseUrl = '/api/patients';

  constructor(private http: HttpClient) {}

  getAllPatients(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiBaseUrl}/getAllPatients?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  
  
}


