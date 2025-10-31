import { TestBed } from '@angular/core/testing';

import { InsuranceData } from './insurance-data';

describe('InsuranceData', () => {
  let service: InsuranceData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
