import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-order.html',
  styleUrl: './create-new-order.css',
  standalone: true,
})
export class CreateNewOrder {
  private router = inject(Router);
  
  searchQuery: string = '';
  showSearchResults: boolean = false;
  selectedPatient: any = null;

  // Sample patients data
  patients = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', patientId: 'PAT-001' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '(555) 234-5678', patientId: 'PAT-002' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 345-6789', patientId: 'PAT-003' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '(555) 456-7890', patientId: 'PAT-004' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', phone: '(555) 567-8901', patientId: 'PAT-005' },
  ];

  filteredPatients: any[] = [];

  onSearchFocus() {
    this.showSearchResults = true;
    this.filterPatients();
  }

  onSearchChange() {
    this.filterPatients();
  }

  filterPatients() {
    if (!this.searchQuery.trim()) {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  selectPatient(patient: any) {
    this.selectedPatient = patient;
    this.searchQuery = '';
    this.showSearchResults = false;
  }

  clearSelection() {
    this.selectedPatient = null;
    this.searchQuery = '';
    this.showSearchResults = false;
  }

  lookupPatient() {
    if (this.searchQuery.trim()) {
      this.filterPatients();
      this.showSearchResults = true;
    }
  }

  addNewPatient() {
    this.router.navigate(['/layout/add-patient']);
  }

  createOrder() {
    if (this.selectedPatient) {
      // Add order creation logic here
    }
  }
}
