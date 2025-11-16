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
  paginatedFacilities: any[] = [];
  allFacilities: any[] = [];
  filteredFacilities: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  totalRecords: number = 0;
  activeCount: number = 0;
  inactiveCount: number = 0;
  loading: boolean = false;
  showDeleteModal: boolean = false;
  facilityToDelete: any = null;
  statusFilter: string = 'all';

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

  deleteFacility(): void {
    if (this.facilityToDelete) {
      this.showDeleteModal = false;
      this.facilityToDelete = null;
      this.loadFacilitiesFromAPI();
    }
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilter();
  }

  calculateCounts(): void {
    this.activeCount = this.allFacilities.filter(f => f.IsActive).length;
    this.inactiveCount = this.allFacilities.filter(f => !f.IsActive).length;
    this.totalRecords = this.allFacilities.length;
  }

  applyFilter(): void {
    let filtered = this.allFacilities;
    
    if (this.statusFilter === 'active') {
      filtered = this.allFacilities.filter(f => f.IsActive);
    } else if (this.statusFilter === 'inactive') {
      filtered = this.allFacilities.filter(f => !f.IsActive);
    }
    
    this.filteredFacilities = filtered;
    this.calculatePagination();
    this.paginateFacilities();
  }

  paginateFacilities(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFacilities = this.filteredFacilities.slice(startIndex, endIndex);
    
    console.log('After Pagination:', {
      filteredCount: this.filteredFacilities.length,
      totalPages: this.totalPages,
      paginatedCount: this.paginatedFacilities.length,
      currentPage: this.currentPage,
      loading: this.loading
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFacilitiesFromAPI();
    }
  }

  loadFacilitiesFromAPI(): void {
    this.loading = true;

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      this.loading = false;
      this.paginatedFacilities = [];
    }, 10000);

    this.facilityService.getAllFacilities(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        clearTimeout(timeoutId);

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

        this.allFacilities = facilities;
        this.calculateCounts();
        this.applyFilter();
        this.loading = false;
        
        console.log('Final State (after loading=false):', {
          allCount: this.allFacilities.length,
          filteredCount: this.filteredFacilities.length,
          paginatedCount: this.paginatedFacilities.length,
          totalPages: this.totalPages,
          loading: this.loading,
          shouldShowPagination: !this.loading && this.paginatedFacilities.length > 0 && this.totalPages > 0
        });
        
        this.cdr.markForCheck();
      },
      error: (error) => {
        clearTimeout(timeoutId);
        alert(`API Error: ${error.status} - ${error.message}\n\nEnsure backend is running.`);
        this.paginatedFacilities = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  calculatePagination(): void {
    const recordCount = this.filteredFacilities.length;

    if (recordCount > 0) {
      this.totalPages = Math.ceil(recordCount / this.pageSize);
    } else {
      this.totalPages = 0;
    }

    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateFacilities();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
