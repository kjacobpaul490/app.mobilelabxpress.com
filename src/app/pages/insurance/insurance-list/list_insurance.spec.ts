import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InsuranceListComponent, Insurance } from './list_insurance';

describe('InsuranceListComponent', () => {
  let component: InsuranceListComponent;
  let fixture: ComponentFixture<InsuranceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceListComponent, BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sample data', () => {
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should display add new form when add button clicked', () => {
    component.onAddNew();
    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeFalse();
  });

  it('should populate form when edit is clicked', () => {
    const testInsurance: Insurance = component.dataSource.data[0];
    component.onEdit(testInsurance);
    
    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.editingId).toBe(testInsurance.id);
    expect(component.insuranceForm.get('NAME')?.value).toBe(testInsurance.NAME);
  });

  it('should delete insurance when confirmed', () => {
    const initialLength = component.dataSource.data.length;
    const testInsurance = component.dataSource.data[0];
    
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete(testInsurance);
    
    expect(component.dataSource.data.length).toBe(initialLength - 1);
  });

  it('should filter data based on search input', () => {
    const testValue = 'John';
    const event = { target: { value: testValue } } as unknown as Event;
    
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe(testValue.toLowerCase());
  });

  it('should validate required fields', () => {
    const form = component.insuranceForm;
    expect(form.valid).toBeFalse();
    
    form.get('NAME')?.setValue('Test Name');
    form.get('POLICY_NAME')?.setValue('Test Policy');
    form.get('CARRIER_CODE')?.setValue('TEST001');
    form.get('PLAN_TYPE')?.setValue('Health');
    form.get('POLICY_NUMBER')?.setValue('POL123');
    form.get('RELATIONSHIP')?.setValue('Self');
    
    expect(form.valid).toBeTrue();
  });
});