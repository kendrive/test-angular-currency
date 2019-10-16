import { TestBed } from '@angular/core/testing';

import { ExchangeApiRequestService } from './exchange-api-request.service';

describe('ExchangeApiRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExchangeApiRequestService = TestBed.get(ExchangeApiRequestService);
    expect(service).toBeTruthy();
  });
});
