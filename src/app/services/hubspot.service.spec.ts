import { TestBed, inject } from '@angular/core/testing';

import { HubspotService } from './hubspot.service';

describe('HubspotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HubspotService]
    });
  });

  it('should be created', inject([HubspotService], (service: HubspotService) => {
    expect(service).toBeTruthy();
  }));
});
