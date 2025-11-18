import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PhysicianService } from '../../../../services/physician';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-physicians',
  imports: [CommonModule],
  templateUrl: './physicians.html',
  styleUrl: './physicians.css',
})
export class Physicians implements OnInit {
  paginatedPhysicians: any[] = [];
  allPhysicians: any[] = [];
  filteredPhysicians: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  private readonly serverBatchSize: number = 20; // API returns 20 records per page
  private readonly requestTimeoutMs: number = 10000;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  totalRecords: number = 0;
  activeCount: number = 0;
  inactiveCount: number = 0;
  loading: boolean = false;
  showDeleteModal: boolean = false;
  physicianToDelete: any = null;
  statusFilter: string = 'all';

  constructor(
    private physicianService: PhysicianService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  addNewPhysician(): void {
    this.router.navigate(['/layout/add-physician']);
  }

  confirmDelete(physician: any): void {
    this.physicianToDelete = physician;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.physicianToDelete = null;
  }

  deletePhysician(): void {
    if (this.physicianToDelete) {
      this.showDeleteModal = false;
      this.physicianToDelete = null;
      this.loadPhysiciansFromAPI();
    }
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilter();
  }

  calculateCounts(): void {
    this.activeCount = this.allPhysicians.filter(p => p.IsActive).length;
    this.inactiveCount = this.allPhysicians.filter(p => !p.IsActive).length;
    this.totalRecords = this.allPhysicians.length;
  }

  applyFilter(): void {
    let filtered = this.allPhysicians;
    
    if (this.statusFilter === 'active') {
      filtered = this.allPhysicians.filter(p => p.IsActive);
    } else if (this.statusFilter === 'inactive') {
      filtered = this.allPhysicians.filter(p => !p.IsActive);
    }
    
    this.filteredPhysicians = filtered;
    this.calculatePagination();
    this.paginatePhysicians();
  }

  paginatePhysicians(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPhysicians = this.filteredPhysicians.slice(startIndex, endIndex);
    
    console.log('After Pagination:', {
      filteredCount: this.filteredPhysicians.length,
      totalPages: this.totalPages,
      paginatedCount: this.paginatedPhysicians.length,
      currentPage: this.currentPage,
      loading: this.loading
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPhysiciansFromAPI();
    }
  }

  loadPhysiciansFromAPI(): void {
    this.loading = true;
    this.allPhysicians = [];
    this.filteredPhysicians = [];
    this.paginatedPhysicians = [];
    this.currentPage = 1;

    this.collectAllPhysicians()
      .then((physicians) => {
        this.allPhysicians = physicians;
        this.calculateCounts();
        this.applyFilter();
      })
      .catch((error) => {
        const message =
          error?.message === 'Request timeout'
            ? 'Request timed out. Please verify the backend service is running.'
            : `API Error: ${error?.status || ''} ${error?.message || ''}\n\nEnsure backend is running.`;
        alert(message.trim());
        this.paginatedPhysicians = [];
        this.totalRecords = 0;
      })
      .finally(() => {
        this.loading = false;
        this.cdr.markForCheck();
      });
  }

  calculatePagination(): void {
    const recordCount = this.filteredPhysicians.length;

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
      this.paginatePhysicians();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private async collectAllPhysicians(): Promise<any[]> {
    const aggregated: any[] = [];
    let pageToFetch = 1;
    let totalPagesFromApi: number | null = null;
    let totalRecordsFromApi: number | null = null;
    let consecutiveEmptyPages = 0;

    console.log('Starting to collect all physicians from API...');

    while (true) {
      try {
        const response = await this.fetchPageWithTimeout(pageToFetch);
        const physicians = this.extractPhysicians(response);
        
        console.log(`Page ${pageToFetch}: Fetched ${physicians.length} physicians`);

        // If we get an empty page, increment counter
        if (physicians.length === 0) {
          consecutiveEmptyPages++;
          // If we get 2 consecutive empty pages, we're done
          if (consecutiveEmptyPages >= 2) {
            console.log('Received 2 consecutive empty pages, stopping fetch');
            break;
          }
        } else {
          consecutiveEmptyPages = 0;
          aggregated.push(...physicians);
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
        if (physicians.length > 0 && physicians.length < this.serverBatchSize) {
          console.log(`Received ${physicians.length} records (less than ${this.serverBatchSize}), assuming last page`);
          break;
        }

        pageToFetch++;
      } catch (error) {
        console.error(`Error fetching page ${pageToFetch}:`, error);
        // If we have some records, return what we have
        if (aggregated.length > 0) {
          console.log(`Stopping due to error, returning ${aggregated.length} physicians collected so far`);
          break;
        }
        throw error;
      }
    }

    this.totalRecords = totalRecordsFromApi ?? aggregated.length;
    console.log(`Finished collecting. Total physicians: ${aggregated.length}, Total records: ${this.totalRecords}`);
    
    return aggregated;
  }

  private fetchPageWithTimeout(pageNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Request timeout')), this.requestTimeoutMs);

      console.log(`Fetching physicians page ${pageNumber} with batch size ${this.serverBatchSize}`);
      
      firstValueFrom(this.physicianService.getAllPhysicians(pageNumber, this.serverBatchSize)).then(
        (response) => {
          clearTimeout(timeoutId);
          console.log(`API Response for page ${pageNumber}:`, response);
          resolve(response);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error(`API Error for page ${pageNumber}:`, error);
          reject(error);
        }
      );
    });
  }

  private extractPhysicians(response: any): any[] {
    console.log('Extracting physicians from response:', response);
    
    if (Array.isArray(response)) {
      console.log('Response is direct array, returning:', response.length, 'items');
      return response;
    }

    if (response?.data && Array.isArray(response.data)) {
      console.log('Found physicians in response.data:', response.data.length, 'items');
      return response.data;
    }

    if (response?.physicians && Array.isArray(response.physicians)) {
      console.log('Found physicians in response.physicians:', response.physicians.length, 'items');
      return response.physicians;
    }

    if (response?.result && Array.isArray(response.result)) {
      console.log('Found physicians in response.result:', response.result.length, 'items');
      return response.result;
    }

    if (response?.items && Array.isArray(response.items)) {
      console.log('Found physicians in response.items:', response.items.length, 'items');
      return response.items;
    }

    console.warn('No physicians found in response. Response structure:', Object.keys(response || {}));
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
