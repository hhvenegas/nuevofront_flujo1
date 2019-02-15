import { TestBed, inject } from '@angular/core/testing';

import { MultilenguajeService } from './multilenguaje.service';

describe('MultilenguajeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultilenguajeService]
    });
  });

  it('should be created', inject([MultilenguajeService], (service: MultilenguajeService) => {
    expect(service).toBeTruthy();
  }));
});
