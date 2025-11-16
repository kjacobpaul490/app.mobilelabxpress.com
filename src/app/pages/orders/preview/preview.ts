import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatusBar } from '../status-bar/status-bar';

@Component({
  selector: 'app-preview',
  imports: [CommonModule, StatusBar],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
  standalone: true,
})
export class Preview {
  private router = inject(Router);

  orderData = {
    patient: 'John Smith',
    patientId: 'PAT-001',
    caseType: 'Lab Test',
    priority: 'Urgent',
    orderType: 'Blood Work',
    insuranceProvider: 'BlueCross BlueShield',
  };

  isSubmitting = false;

  onSubmit() {
    this.isSubmitting = true;
    setTimeout(() => {
      console.log('Order submitted successfully');
      alert('Order has been created successfully!');
      this.router.navigate(['/layout/manage-orders']);
    }, 1500);
  }

  onBack() {
    this.router.navigate(['/layout/order-information']);
  }

  onEdit() {
    this.router.navigate(['/layout/create-new-order']);
  }
}
