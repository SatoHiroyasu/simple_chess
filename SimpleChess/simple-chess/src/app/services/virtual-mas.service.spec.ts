import { TestBed } from '@angular/core/testing';

import { VirtualMasService } from './virtual-mas.service';

describe('VirtualMasService', () => {
  let service: VirtualMasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualMasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
