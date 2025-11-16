import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceInformation } from './insurance-information';

describe('InsuranceInformation', () => {
  let component: InsuranceInformation;
  let fixture: ComponentFixture<InsuranceInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
