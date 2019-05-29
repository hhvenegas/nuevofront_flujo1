import { TestBed, inject } from '@angular/core/testing';

import { QuotationColombiaService } from './quotation-colombia.service';

describe('QuotationColombiaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationColombiaService]
    });
  });

  it('should be created', inject([QuotationColombiaService], (service: QuotationColombiaService) => {
    expect(service).toBeTruthy();
  }));
});
