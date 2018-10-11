import { TestBed, inject } from '@angular/core/testing';

import { OperatorsService } from './operators.service';

describe('OperatorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperatorsService]
    });
  });

  it('should be created', inject([OperatorsService], (service: OperatorsService) => {
    expect(service).toBeTruthy();
  }));
});
