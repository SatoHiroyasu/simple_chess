import { TestBed } from '@angular/core/testing';

import { PiecesInfoService } from './pieces-info.service';

describe('PiecesInfoService', () => {
  let service: PiecesInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiecesInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
