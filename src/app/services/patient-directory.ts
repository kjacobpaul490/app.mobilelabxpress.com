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
    // Backend currently expects the format ...getAllPatients?1/20
    // but will also accept traditional query params via proxy rewrite.
    const legacyQueryFormat = `${pageNumber}/${pageSize}`;
    const url = `${this.apiBaseUrl}/getAllPatients?${legacyQueryFormat}`;
    return this.http.get<any>(url);
  }
}


