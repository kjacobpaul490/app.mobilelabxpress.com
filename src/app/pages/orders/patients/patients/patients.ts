import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { PatientDirectoryService } from '../../../../services/patient-directory';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  paginatedPatients: any[] = [];
  allPatients: any[] = [];
  filteredPatients: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  private readonly serverBatchSize: number = this.pageSize;
  private readonly requestTimeoutMs: number = 10000;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  totalRecords: number = 0;
  activeCount: number = 0;
  inactiveCount: number = 0;
  loading: boolean = false;
  showDeleteModal: boolean = false;
  patientToDelete: any = null;
  statusFilter: string = 'all';

  constructor(
    private patientService: PatientDirectoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPatientsFromAPI();
    }
  }

  addNewPatient(): void {
    this.router.navigate(['/layout/add-patient']);
  }

  confirmDelete(patient: any): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  deletePatient(): void {
    if (this.patientToDelete) {
      // Placeholder for delete integration
      this.showDeleteModal = false;
      this.patientToDelete = null;
      this.loadPatientsFromAPI();
    }
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilter();
  }

  isPatientActive(patient: any): boolean {
    if (patient == null) {
      return true;
    }
    return patient.IsActive ?? patient.isActive ?? true;
  }

  calculateCounts(): void {
    this.activeCount = this.allPatients.filter((p) => this.isPatientActive(p)).length;
    this.inactiveCount = this.allPatients.filter((p) => !this.isPatientActive(p)).length;
    this.totalRecords = this.allPatients.length;
  }

  applyFilter(): void {
    let filtered = this.allPatients;

    if (this.statusFilter === 'active') {
      filtered = this.allPatients.filter((p) => this.isPatientActive(p));
    } else if (this.statusFilter === 'inactive') {
      filtered = this.allPatients.filter((p) => !this.isPatientActive(p));
    }

    this.filteredPatients = filtered;
    this.calculatePagination();
    this.paginatePatients();
  }

  calculatePagination(): void {
    const recordCount = this.filteredPatients.length;
    this.totalPages = recordCount > 0 ? Math.ceil(recordCount / this.pageSize) : 0;
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  paginatePatients(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPatients = this.filteredPatients.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatePatients();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadPatientsFromAPI(): void {
    this.loading = true;
    this.allPatients = [];
    this.filteredPatients = [];
    this.paginatedPatients = [];
    this.currentPage = 1;

    this.collectAllPatients()
      .then((patients) => {
        this.allPatients = patients;
        this.calculateCounts();
        this.applyFilter();
      })
      .catch((error) => {
        const message =
          error?.message === 'Request timeout'
            ? 'Request timed out. Please verify the backend service is running.'
            : `API Error: ${error?.status || ''} ${error?.message || ''}\n\nEnsure backend is running.`;
        alert(message.trim());
        this.paginatedPatients = [];
        this.totalRecords = 0;
      })
      .finally(() => {
        this.loading = false;
        this.cdr.markForCheck();
      });
  }

  private async collectAllPatients(): Promise<any[]> {
    const aggregated: any[] = [];
    let pageToFetch = 1;
    let totalPagesFromApi: number | null = null;
    let totalRecordsFromApi: number | null = null;
    let consecutiveEmptyPages = 0;

    while (true) {
      try {
        const response = await this.fetchPageWithTimeout(pageToFetch);
        const patients = this.extractPatients(response);

        if (patients.length === 0) {
          consecutiveEmptyPages++;
          if (consecutiveEmptyPages >= 2) {
            break;
          }
        } else {
          consecutiveEmptyPages = 0;
          aggregated.push(...patients);
        }

        if (pageToFetch === 1) {
          totalRecordsFromApi = this.extractTotalRecords(response, null);
          totalPagesFromApi = this.extractTotalPages(response);
        }

        if (totalPagesFromApi !== null && pageToFetch >= totalPagesFromApi) {
          break;
        }

        if (patients.length > 0 && patients.length < this.serverBatchSize) {
          break;
        }

        pageToFetch++;
      } catch (error) {
        if (aggregated.length > 0) {
          break;
        }
        throw error;
      }
    }

    this.totalRecords = totalRecordsFromApi ?? aggregated.length;
    return aggregated;
  }

  private fetchPageWithTimeout(pageNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Request timeout')), this.requestTimeoutMs);

      firstValueFrom(this.patientService.getAllPatients(pageNumber, this.serverBatchSize)).then(
        (response) => {
          clearTimeout(timeoutId);
          resolve(response);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  }

  private extractPatients(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (response?.patients && Array.isArray(response.patients)) {
      return response.patients;
    }

    if (response?.result && Array.isArray(response.result)) {
      return response.result;
    }

    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }

    return [];
  }

  private extractTotalRecords(response: any, fallback: number | null): number | null {
    const value =
      response?.totalRecords ??
      response?.totalCount ??
      response?.count ??
      response?.pagination?.totalRecords ??
      response?.pagination?.totalCount ??
      response?.meta?.totalRecords ??
      response?.meta?.totalCount ??
      null;

    return value !== null ? value : fallback;
  }

  private extractTotalPages(response: any): number | null {
    return response?.totalPages ?? response?.pagination?.totalPages ?? response?.meta?.totalPages ?? null;
  }

  getPatientFullName(patient: any): string {
    if (!patient) {
      return '';
    }
    const parts = [
      patient.FirstName ?? patient.firstName ?? '',
      patient.MiddleName ?? patient.middleName ?? '',
      patient.LastName ?? patient.lastName ?? '',
    ].filter(Boolean);
    return parts.join(' ') || patient.Name || patient.name || 'Unnamed Patient';
  }

  getPatientInitials(patient: any): string {
    const [first, middle, last] = [
      patient?.FirstName ?? patient?.firstName ?? '',
      patient?.MiddleName ?? patient?.middleName ?? '',
      patient?.LastName ?? patient?.lastName ?? '',
    ];
    const initials = `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`;
    return initials.toUpperCase() || 'PT';
  }

  getPatientStatus(patient: any): string {
    return this.isPatientActive(patient) ? 'Active' : 'Inactive';
  }
}

