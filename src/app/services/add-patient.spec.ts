import { TestBed } from '@angular/core/testing';

import { AddPatient } from './add-patient';

describe('AddPatient', () => {
  let service: AddPatient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPatient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
