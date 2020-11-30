import { TestBed } from '@angular/core/testing';

import { PieceRuleService } from './piece-rule.service';

describe('PieceRuleService', () => {
  let service: PieceRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
