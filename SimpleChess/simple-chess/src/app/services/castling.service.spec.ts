import { TestBed } from '@angular/core/testing';

import { CastlingService } from './castling.service';

describe('CastlingService', () => {
  let service: CastlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CastlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
