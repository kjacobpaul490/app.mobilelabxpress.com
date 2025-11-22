import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Insurance {
 INSURANCE_GUID: string;
  id: number;
  NAME: string;
  POLICY_NAME: string;
  CARRIER_CODE: string;
  PLAN_TYPE: string;
  POLICY_NUMBER: string;
  GROUP_NUMBER: string;
  RELATIONSHIP: string;
  createdDate: Date;
}

@Component({
  selector: 'app-insurance-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './list_insurance.html',
  styleUrls: ['./list_insurance.css']
})
export class InsuranceListComponent implements OnInit {

  displayedColumns: string[] = [
   
    'id', 
    'NAME', 
    'POLICY_NAME', 
    'CARRIER_CODE', 
    'PLAN_TYPE', 
    'POLICY_NUMBER', 
    'GROUP_NUMBER', 
    'RELATIONSHIP', 
    'actions'
  ];
  
  insuranceData: Insurance[] = [];
  insuranceForm: FormGroup;
  showForm = false;
  isEditMode = false;
  editingId: number | null = null;
  showSuccessPopup = false;
  successMessage = '';

  // pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  currentPage = 1;
  totalPages = 0;

  // search & sort
  searchTerm = '';
  sortColumn = 'created_dt';
  sortDirection = 'DESC';

  relationships = ['Self', 'Spouse', 'Child', 'Parent'];
  planTypes = ['Health', 'Dental', 'Vision', 'Life'];

  // No static sample data — component will load data from the API at runtime

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.insuranceForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInsuranceData(1, this.pageSize);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      NAME: ['', Validators.required],
      POLICY_NAME: ['', Validators.required],
      CARRIER_CODE: ['', Validators.required],
      PLAN_TYPE: ['', Validators.required],
      POLICY_NUMBER: ['', [Validators.required, Validators.minLength(3)]],
      GROUP_NUMBER: [''],
      RELATIONSHIP: ['', Validators.required]
    });
  }

  /**
   * Load insurance data from API with pagination, search, and sort via POST body.
   */
  loadInsuranceData(pageNumber: number, pageSize: number): void {
    const url = `/api/insurance/getAllInsurances/${pageNumber}/${pageSize}`;
    const body = {
      Search: this.searchTerm,
      SortColumn: this.sortColumn,
      SortDirection: this.sortDirection
    };
    this.http.post<any>(url, body).subscribe({
      next: res => {
        // Parse new API shape: { result: { totalCount, data: [...] } }
        if (res?.result?.data && Array.isArray(res.result.data)) {
          const mapped: Insurance[] = res.result.data.map((r: any) => ({
            INSURANCE_GUID: r.INSURANCE_GUID ?? '',
            id: r.INSURANCE_ID ?? r.id ?? 0,
            NAME: r.NAME ?? '',
            POLICY_NAME: r.POLICY_NAME ?? '',
            CARRIER_CODE: r.CARRIER_CODE ?? '',
            PLAN_TYPE: r.PLAN_TYPE ?? '',
            POLICY_NUMBER: r.POLICY_NUMBER ?? '',
            GROUP_NUMBER: r.GROUP_NUMBER ?? '',
            RELATIONSHIP: r.RELATIONSHIP ?? '',
            createdDate: r.createdDate ? new Date(r.createdDate) : new Date()
          }));
          this.insuranceData = mapped;
          this.totalItems = res.result.totalCount ?? mapped.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        } else {
          console.warn('Unexpected response shape from', url, res);
          this.insuranceData = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      },
      error: err => {
        console.error('Failed to load insurance data:', err);
        // clear data on error
        this.insuranceData = [];
        this.totalItems = 0;
        this.totalPages = 0;
      }
    });
  }

  onAddNew(): void {
    // Navigate to add-insurance page in add mode
    this.router.navigate(['/layout/add-insurance'], { queryParams: { mode: 'add' } });
  }

  onEdit(insurance: Insurance): void {
    // Navigate to add-insurance page in edit mode, passing the GUID/id
    this.router.navigate(['/layout/add-insurance', insurance.INSURANCE_GUID], { queryParams: { mode: 'edit' } });
  }

  onView(insurance: Insurance): void {
    // Navigate to add-insurance page in view mode
    this.router.navigate(['/layout/add-insurance', insurance.INSURANCE_GUID], { queryParams: { mode: 'view' } });
  }

  onDelete(insurance: Insurance): void {
    if (confirm(`Are you sure you want to delete insurance for ${insurance.NAME}?`)) {
      const deleteUrl = `/api/insurance//insuraneDeletedByGuid/${insurance.INSURANCE_GUID}`;
      this.http.get<any>(deleteUrl).subscribe({
        next: (res) => {
          // Remove from local data
          this.insuranceData = this.insuranceData.filter((item: Insurance) => item.INSURANCE_GUID !== insurance.INSURANCE_GUID);
          this.showSuccessMessage('Insurance deleted successfully!');
          // Reload data to update totals and pagination
          this.loadInsuranceData(this.currentPage, this.pageSize);
        },
        error: (err) => {
          console.error('Failed to delete insurance:', err);
          alert('Failed to delete insurance. Please try again.');
        }
      });
    }
  }

  onSave(): void {
    if (this.insuranceForm.valid) {
      const formData = this.insuranceForm.value;

      if (this.isEditMode && this.editingId) {
        // Update existing record
        const index = this.insuranceData.findIndex((item: Insurance) => item.id === this.editingId);
        if (index !== -1) {
          this.insuranceData[index] = {
            ...this.insuranceData[index],
            ...formData
          };
        }
        this.showSuccessMessage('Insurance updated successfully!');
      } else {
        // Add new record
        const newInsurance: Insurance = {
          INSURANCE_GUID: '',
          id: Math.max(...this.insuranceData.map((item: Insurance) => item.id), 0) + 1,
          ...formData,
          createdDate: new Date()
        };
        this.insuranceData = [...this.insuranceData, newInsurance];
        this.showSuccessMessage('Insurance added successfully!');
      }

      this.showForm = false;
      this.insuranceForm.reset();
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset(): void {
    this.insuranceForm.reset();
    if (this.isEditMode) {
      this.showForm = false;
    }
  }

  onCancel(): void {
    this.showForm = false;
    this.insuranceForm.reset();
    this.isEditMode = false;
    this.editingId = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.insuranceForm.controls).forEach(key => {
      this.insuranceForm.get(key)?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.currentPage = 1;
    this.loadInsuranceData(this.currentPage, this.pageSize);
  }

  onSortChange(column: string): void {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.currentPage = 1;
    this.loadInsuranceData(this.currentPage, this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.pageIndex = page - 1;
    this.loadInsuranceData(page, this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, this.currentPage - halfWindow);
    let end = Math.min(this.totalPages, start + maxPagesToShow - 1);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}