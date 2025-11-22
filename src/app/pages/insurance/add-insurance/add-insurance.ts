import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-insurance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-insurance.html',
  styleUrls: ['./add-insurance.css']
})
export class AddInsuranceComponent implements OnInit {
  insuranceForm: FormGroup;
  showSuccessPopup = false;

  
  mode: 'add' | 'edit' | 'view' = 'add';
  insuranceGuid: string | null = null;

  relationships = ['Self', 'Spouse', 'Child', 'Parent'];
  planTypes = ['Health', 'Dental', 'Vision', 'Life'];

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.insuranceForm = this.createForm();
  }

  ngOnInit(): void {
    // check for route param and query param to determine mode
    this.route.paramMap.subscribe(params => {
      const guid = params.get('insuranceGuid');
      this.insuranceGuid = guid;
      this.route.queryParamMap.subscribe(q => {
        const m = q.get('mode');
        if (m === 'view') {
          this.mode = 'view';
        } else if (m === 'edit') {
          this.mode = 'edit';
        } else if (guid) {
          // default to edit if guid present without explicit mode
          this.mode = 'edit';
        } else {
          this.mode = 'add';
        }

        if (this.insuranceGuid) {
          this.getInsuranceByGuid(this.insuranceGuid);
        } else {
          // new entry: ensure form enabled
          if (this.mode !== 'view') {
            this.insuranceForm.enable();
          }
        }
      });
    });
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

  private getInsuranceByGuid(guid: string): void {
    const url = `/api/insurance/getinsuranceByGuid/${guid}`;
    this.http.get<any>(url).subscribe({
      next: res => {
        const item = Array.isArray(res?.result) ? res.result[0] : (res?.result || res);
        if (item) {
          this.insuranceForm.patchValue({
            NAME: item.NAME ?? '',
            POLICY_NAME: item.POLICY_NAME ?? '',
            CARRIER_CODE: item.CARRIER_CODE ?? '',
            PLAN_TYPE: item.PLAN_TYPE ?? '',
            POLICY_NUMBER: item.POLICY_NUMBER ?? '',
            GROUP_NUMBER: item.GROUP_NUMBER ?? '',
            RELATIONSHIP: item.RELATIONSHIP ?? ''
          });
        }

        if (this.mode === 'view') {
          this.insuranceForm.disable();
        } else {
          this.insuranceForm.enable();
        }
      },
      error: err => {
        console.error('Failed to fetch insurance by guid', err);
      }
    });
  }

  onSave(): void {
    if (this.insuranceForm.valid) {
      const url = `/api/insurance/addInsuranceandUpdateByGuid`;
      const body: any = { ...this.insuranceForm.value };
      // If editing, include the guid so backend updates instead of creating
      if (this.mode === 'edit' && this.insuranceGuid) {
        body.insuranceGuid = this.insuranceGuid;
      }

      this.http.post(url, body).subscribe({
        next: () => {
          this.showSuccessPopup = true;
          setTimeout(() => this.showSuccessPopup = false, 3000);
          this.router.navigate(['/layout/list-insurance']);
        },
        error: err => console.error('Save failed', err)
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // onUpdate removed: backend handles add/update at the same endpoint via POST

  onEditFromView(): void {
    // switch from view mode to edit mode in-place
    this.mode = 'edit';
    this.insuranceForm.enable();
  }

  onReset(): void {
    this.insuranceForm.reset();
    if (this.insuranceGuid && this.mode !== 'add') {
      // reload original values
      this.getInsuranceByGuid(this.insuranceGuid);
    }
  }

  onCancel(): void {
    // navigate back to list
    this.router.navigate(['/layout/list-insurance']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.insuranceForm.controls).forEach(key => {
      this.insuranceForm.get(key)?.markAsTouched();
    });
  }
}