import { TestBed } from '@angular/core/testing';

import { BoardInfoService } from './board-info.service';

describe('BoardInfoService', () => {
  let service: BoardInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
