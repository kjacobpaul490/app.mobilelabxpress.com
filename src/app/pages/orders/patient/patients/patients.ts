/**
 * Patients Component
 * 
 * Manages the patient directory listing with features:
 * - Paginated display of patients
 * - Active/Inactive filtering
 * - Delete confirmation modal
 * - Server-side rendering (SSR) support
 * - Automatic fetching of all pages from API
 */

/**
 * Patients Component
 * 
 * Manages the patient directory listing with features:
 * - Paginated display of patients
 * - Active/Inactive filtering
 * - Delete confirmation modal
 * - Server-side rendering (SSR) support
 * - Automatic fetching of all pages from API
 */

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
  // Pagination data arrays
  paginatedPatients: any[] = []; // Current page of patients to display
  allPatients: any[] = []; // Complete list of all patients from API

  // Pagination configuration
  currentPage: number = 1; // Current page number (1-indexed)
  pageSize: number = 10; // Number of patients to display per page
  private readonly serverBatchSize: number = this.pageSize; // API batch size for fetching
  private readonly requestTimeoutMs: number = 10000; // 10 second timeout for API requests
  totalPages: number = 0; // Total number of pages
  totalPagesArray: number[] = []; // Array of page numbers for pagination UI
  totalRecords: number = 0; // Total patient count from API

  // UI state flags
  loading: boolean = false; // Loading indicator for API calls
  showDeleteModal: boolean = false; // Controls delete confirmation modal visibility
  patientToDelete: any = null; // Patient object pending deletion

  constructor(
    private patientService: PatientDirectoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Platform identifier for SSR detection
  ) {}

  /**
   * Component initialization lifecycle hook
   * Only loads data in browser environment to prevent SSR hydration issues
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPatientsFromAPI();
    }
  }

  /**
   * Navigates to the add patient form
   */
  addNewPatient(): void {
    this.router.navigate(['/layout/add-patient']);
  }

  /**
   * Opens the delete confirmation modal for a patient
   * @param patient - The patient object to be deleted
   */
  confirmDelete(patient: any): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  /**
   * Closes the delete confirmation modal without deleting
   */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  /**
   * Executes patient deletion and refreshes the list
   * TODO: Integrate with actual delete API endpoint
   */
  deletePatient(): void {
    if (this.patientToDelete) {
      // Placeholder for delete integration
      this.showDeleteModal = false;
      this.patientToDelete = null;
      this.loadPatientsFromAPI();
    }
  }

  /**
   * Checks if patient is a homebound patient
   * @param patient - The patient object to check
   * @returns true if homebound, false otherwise
   */
  isHomeboundPatient(patient: any): boolean {
    return patient?.IsHomeboundPatient ?? patient?.isHomeboundPatient ?? false;
  }

  /**
   * Checks if patient is a hard stick patient
   * @param patient - The patient object to check
   * @returns true if hard stick, false otherwise
   */
  isHardStick(patient: any): boolean {
    return patient?.IsHardStick ?? patient?.isHardStick ?? false;
  }

  /**
   * Calculates total pages and generates page number array for pagination UI
   */
  calculatePagination(): void {
    const recordCount = this.allPatients.length;
    this.totalPages = recordCount > 0 ? Math.ceil(recordCount / this.pageSize) : 0;
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Slices the patients array to get only the current page items
   */
  paginatePatients(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPatients = this.allPatients.slice(startIndex, endIndex);
  }

  /**
   * Changes the current page and scrolls to top
   * @param page - Target page number (1-indexed)
   */
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
    this.paginatedPatients = [];
    this.currentPage = 1;

    this.collectAllPatients()
      .then((patients) => {
        this.allPatients = patients;
        this.totalRecords = patients.length;
        this.calculatePagination();
        this.paginatePatients();
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

  /**
   * Collects all patients by fetching multiple pages from the API
   * 
   * Strategy:
   * - Fetches pages sequentially starting from page 1
   * - Stops when: 2 consecutive empty pages, API-reported last page reached, or partial page received
   * - Extracts pagination metadata from first response
   * - Aggregates all patient records into a single array
   * 
   * @returns Promise resolving to array of all patient records
   * @throws Error if first page fails or timeout occurs
   */
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

        // Track consecutive empty pages to detect end of data
        if (patients.length === 0) {
          consecutiveEmptyPages++;
          if (consecutiveEmptyPages >= 2) {
            break; // Stop after 2 consecutive empty pages
          }
        } else {
          consecutiveEmptyPages = 0;
          aggregated.push(...patients); // Add patients to collection
        }

        // Extract metadata from first response only
        if (pageToFetch === 1) {
          totalRecordsFromApi = this.extractTotalRecords(response, null);
          totalPagesFromApi = this.extractTotalPages(response);
        }

        // Stop if we've reached the last page per API metadata
        if (totalPagesFromApi !== null && pageToFetch >= totalPagesFromApi) {
          break;
        }

        // Stop if we received a partial page (less than batch size)
        if (patients.length > 0 && patients.length < this.serverBatchSize) {
          break;
        }

        pageToFetch++;
      } catch (error) {
        // If we have some data, return it; otherwise propagate error
        if (aggregated.length > 0) {
          break;
        }
        throw error;
      }
    }

    this.totalRecords = totalRecordsFromApi ?? aggregated.length;
    return aggregated;
  }

  /**
   * Fetches a single page of patients with timeout protection
   * @param pageNumber - The page number to fetch (1-indexed)
   * @returns Promise resolving to API response
   * @throws Error with message 'Request timeout' if request exceeds timeout duration
   */
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

  /**
   * Extracts patient array from various API response formats
   * Handles multiple property name variations for flexibility
   * @param response - The raw API response object
   * @returns Array of patient objects, or empty array if none found
   */
  private extractPatients(response: any): any[] {
    // Direct array response
    if (Array.isArray(response)) {
      return response;
    }

    // Check common property names for patient data
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

    return []; // No patients found in response
  }

  /**
   * Extracts total record count from various API response formats
   * @param response - The API response object
   * @param fallback - Default value if no count found
   * @returns Total record count or fallback value
   */
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

  /**
   * Extracts total page count from API response
   * @param response - The API response object
   * @returns Total page count or null if not found
   */
  private extractTotalPages(response: any): number | null {
    return response?.totalPages ?? response?.pagination?.totalPages ?? response?.meta?.totalPages ?? null;
  }

  /**
   * Constructs full name from patient object
   * Handles multiple property name variations (PascalCase and camelCase)
   * @param patient - The patient object
   * @returns Formatted full name or fallback value
   */
  getPatientFullName(patient: any): string {
    if (!patient) {
      return '';
    }
    const parts = [
      patient.FirstName ?? patient.firstName ?? '',
      patient.MiddleName ?? patient.middleName ?? '',
      patient.LastName ?? patient.lastName ?? '',
    ].filter(Boolean); // Remove empty parts
    return parts.join(' ') || patient.Name || patient.name || 'Unnamed Patient';
  }

  /**
   * Generates initials from patient's first and last name
   * @param patient - The patient object
   * @returns Two-letter initials in uppercase, or 'PT' as fallback
   */
  getPatientInitials(patient: any): string {
    const [first, middle, last] = [
      patient?.FirstName ?? patient?.firstName ?? '',
      patient?.MiddleName ?? patient?.middleName ?? '',
      patient?.LastName ?? patient?.lastName ?? '',
    ];
    const initials = `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`;
    return initials.toUpperCase() || 'PT'; // Default to 'PT' for Patient
  }
}

