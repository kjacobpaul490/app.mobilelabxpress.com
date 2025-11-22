import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInsuranceComponent } from './add-insurance';

describe('AddInsuranceComponent', () => {
  let component: AddInsuranceComponent;
  let fixture: ComponentFixture<AddInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInsuranceComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.insuranceForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.insuranceForm;
    expect(form.get('NAME')?.errors?.['required']).toBeTruthy();
    
    form.get('NAME')?.setValue('John Doe');
    expect(form.get('NAME')?.errors).toBeNull();
  });

  it('should show success popup on valid form submission', () => {
    spyOn(console, 'log');
    component.insuranceForm.setValue({
      NAME: 'John Doe',
      POLICY_NAME: 'Premium Plan',
      CARRIER_CODE: 'CC123',
      PLAN_TYPE: 'Health',
      POLICY_NUMBER: 'POL123',
      GROUP_NUMBER: 'GRP123',
      RELATIONSHIP: 'Self'
    });

    component.onSave();
    expect(component.showSuccessPopup).toBeTrue();
    expect(console.log).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.insuranceForm.patchValue({
      NAME: 'Test Name',
      POLICY_NAME: 'Test Policy'
    });
    
    component.onReset();
    expect(component.insuranceForm.get('NAME')?.value).toBeNull();
    expect(component.insuranceForm.get('POLICY_NAME')?.value).toBeNull();
  });
});