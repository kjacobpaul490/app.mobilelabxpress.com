import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-orders',
  imports: [CommonModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
  standalone: true,
})
export class ManageOrders {
  private router = inject(Router);

  // Sample orders data
  orders = [
    {
      id: 'ORD-001',
      patientName: 'John Smith',
      orderDate: '2025-10-20',
      status: 'Pending',
      type: 'Lab Test',
    },
    {
      id: 'ORD-002',
      patientName: 'Jane Doe',
      orderDate: '2025-10-21',
      status: 'In Progress',
      type: 'Imaging',
    },
    {
      id: 'ORD-003',
      patientName: 'Robert Johnson',
      orderDate: '2025-10-22',
      status: 'Completed',
      type: 'Lab Test',
    },
    {
      id: 'ORD-004',
      patientName: 'Sarah Williams',
      orderDate: '2025-10-23',
      status: 'Pending',
      type: 'Consultation',
    },
  ];

  createNewOrder() {
    this.router.navigate(['/layout/create-new-order']);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }
}
