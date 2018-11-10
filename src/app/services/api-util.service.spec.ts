import { TestBed } from '@angular/core/testing';

import { ApiUtilService } from './api-util.service';

describe('ApiUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiUtilService = TestBed.get(ApiUtilService);
    expect(service).toBeTruthy();
  });
});
