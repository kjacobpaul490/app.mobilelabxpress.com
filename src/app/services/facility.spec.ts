import { TestBed } from '@angular/core/testing';

import { AddFacilityService } from './facility';

describe('AddFacilityService', () => {
  let service: AddFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
