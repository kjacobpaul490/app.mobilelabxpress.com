import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AddFacilityService } from '../../../services/facility';

@Component({
  selector: 'app-facilities',
  imports: [CommonModule],
  templateUrl: './facilities.html',
  styleUrl: './facilities.css',
})
export class Facilities implements OnInit {
  paginatedFacilities: any[] = []; // Current page to display
  currentPage: number = 1;
  pageSize: number = 10;
  private readonly requestTimeoutMs: number = 10000;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  showDeleteModal: boolean = false;
  facilityToDelete: any = null;

  constructor(
    private facilityService: AddFacilityService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  addNewFacility(): void {
    this.router.navigate(['/layout/add-facility']);
  }

  confirmDelete(facility: any): void {
    this.facilityToDelete = facility;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.facilityToDelete = null;
  }

  /**
   * Deletes a facility via API and refreshes the list
   */
  deleteFacility(): void {
    debugger;
    if (this.facilityToDelete) {
      const facilityGuid = this.facilityToDelete.Guid;

      if (!facilityGuid) {
        this.showDeleteModal = false;
        this.facilityToDelete = null;
        return;
      }

      // Show loading state
      const facilityName = this.facilityToDelete.Name || this.facilityToDelete.name || 'facility';
      this.loading = true;

      this.facilityService.deleteFacility(facilityGuid).subscribe({
        next: (response) => {
          this.loading = false;
          this.showDeleteModal = false;
          this.facilityToDelete = null;
          // Reload current page
          this.loadFacilitiesPage(this.currentPage);
        },
        error: (error) => {
          this.loading = false;
          this.showDeleteModal = false;
          this.facilityToDelete = null;
        }
      });
    }
  }

  /**
   * Calculates pagination based on total records from API
   */
  calculatePagination(): void {
    if (this.totalRecords > 0) {
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    } else {
      this.totalPages = 0;
    }
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFacilitiesPage(1);
    }
  }

  /**
   * Loads facilities for a specific page from API (server-side pagination)
   * @param page - Page number to load
   */
  loadFacilitiesPage(page: number): void {
    this.loading = true;

    const timeoutId = setTimeout(() => {
      this.loading = false;
      this.paginatedFacilities = [];
    }, this.requestTimeoutMs);

    // Request specific page from backend
    this.facilityService.getAllFacilities(page, this.pageSize).subscribe({
      next: (response) => {
        clearTimeout(timeoutId);
        
        // Extract facilities array
        let facilities: any[] = [];
        if (Array.isArray(response)) {
          facilities = response;
        } else if (response?.data && Array.isArray(response.data)) {
          facilities = response.data;
        } else if (response?.facilities && Array.isArray(response.facilities)) {
          facilities = response.facilities;
        } else if (response?.result && Array.isArray(response.result)) {
          facilities = response.result;
        }

        this.paginatedFacilities = facilities;
        this.currentPage = page;
        
        // Get total records from API response or estimate
        if (response?.totalRecords) {
          this.totalRecords = response.totalRecords;
        } else if (response?.total) {
          this.totalRecords = response.total;
        } else {
          // Estimate: if we get full page, there might be more pages
          this.totalRecords = facilities.length < this.pageSize 
            ? ((page - 1) * this.pageSize) + facilities.length
            : page * this.pageSize + 1;
        }
        
        this.calculatePagination();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        clearTimeout(timeoutId);
        this.paginatedFacilities = [];
        this.totalRecords = 0;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }


  /**
   * Changes to a different page and loads data from API
   * @param page - Target page number
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadFacilitiesPage(page);
    }
  }

}
