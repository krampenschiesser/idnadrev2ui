import { TestBed } from '@angular/core/testing';

import { PersistedFileService } from './persistedfile.service';

describe('PersistedfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersistedFileService = TestBed.get(PersistedFileService);
    expect(service).toBeTruthy();
  });
});
