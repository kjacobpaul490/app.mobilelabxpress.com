import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AddFacilityService } from '../../../services/facility';
import { firstValueFrom } from 'rxjs';

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
  private readonly serverBatchSize: number = 10; // API returns 10 records per page
  private readonly requestTimeoutMs: number = 10000;
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
    this.allFacilities = [];
    this.filteredFacilities = [];
    this.paginatedFacilities = [];
    this.currentPage = 1;

    this.collectAllFacilities()
      .then((facilities) => {
        this.allFacilities = facilities;
        this.calculateCounts();
        this.applyFilter();
      })
      .catch((error) => {
        const message =
          error?.message === 'Request timeout'
            ? 'Request timed out. Please verify the backend service is running.'
            : `API Error: ${error?.status || ''} ${error?.message || ''}\n\nEnsure backend is running.`;
        alert(message.trim());
        this.paginatedFacilities = [];
        this.totalRecords = 0;
      })
      .finally(() => {
        this.loading = false;
        this.cdr.markForCheck();
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

  private async collectAllFacilities(): Promise<any[]> {
    const aggregated: any[] = [];
    let pageToFetch = 1;
    let totalPagesFromApi: number | null = null;
    let totalRecordsFromApi: number | null = null;
    let consecutiveEmptyPages = 0;

    console.log('Starting to collect all facilities from API...');

    while (true) {
      try {
        const response = await this.fetchPageWithTimeout(pageToFetch);
        const facilities = this.extractFacilities(response);
        
        console.log(`Page ${pageToFetch}: Fetched ${facilities.length} facilities`);

        // If we get an empty page, increment counter
        if (facilities.length === 0) {
          consecutiveEmptyPages++;
          // If we get 2 consecutive empty pages, we're done
          if (consecutiveEmptyPages >= 2) {
            console.log('Received 2 consecutive empty pages, stopping fetch');
            break;
          }
        } else {
          consecutiveEmptyPages = 0;
          aggregated.push(...facilities);
        }

        // Try to extract metadata from first response
        if (pageToFetch === 1) {
          totalRecordsFromApi = this.extractTotalRecords(response, null);
          totalPagesFromApi = this.extractTotalPages(response);
          
          if (totalRecordsFromApi !== null) {
            console.log(`API reports total records: ${totalRecordsFromApi}`);
          }
          if (totalPagesFromApi !== null) {
            console.log(`API reports total pages: ${totalPagesFromApi}`);
          }
        }

        // Check if we've reached the last page based on metadata
        if (totalPagesFromApi !== null && pageToFetch >= totalPagesFromApi) {
          console.log(`Reached last page according to API metadata (page ${totalPagesFromApi})`);
          break;
        }

        // If we got fewer records than expected, we've likely reached the end
        if (facilities.length > 0 && facilities.length < this.serverBatchSize) {
          console.log(`Received ${facilities.length} records (less than ${this.serverBatchSize}), assuming last page`);
          break;
        }

        pageToFetch++;
      } catch (error) {
        console.error(`Error fetching page ${pageToFetch}:`, error);
        // If we have some records, return what we have
        if (aggregated.length > 0) {
          console.log(`Stopping due to error, returning ${aggregated.length} facilities collected so far`);
          break;
        }
        throw error;
      }
    }

    this.totalRecords = totalRecordsFromApi ?? aggregated.length;
    console.log(`Finished collecting. Total facilities: ${aggregated.length}, Total records: ${this.totalRecords}`);
    
    return aggregated;
  }

  private fetchPageWithTimeout(pageNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Request timeout')), this.requestTimeoutMs);

      firstValueFrom(this.facilityService.getAllFacilities(pageNumber, this.serverBatchSize)).then(
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

  private extractFacilities(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (response?.facilities && Array.isArray(response.facilities)) {
      return response.facilities;
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
    return (
      response?.totalPages ??
      response?.pagination?.totalPages ??
      response?.meta?.totalPages ??
      null
    );
  }
}
