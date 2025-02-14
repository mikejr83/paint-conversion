import { TestBed } from '@angular/core/testing';

import { PaintsService } from './paints.service';

describe('PaintsService', () => {
  let service: PaintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
