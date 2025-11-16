import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseInformation } from './case-information';

describe('CaseInformation', () => {
  let component: CaseInformation;
  let fixture: ComponentFixture<CaseInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
