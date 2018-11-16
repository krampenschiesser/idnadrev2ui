import { TestBed } from '@angular/core/testing';

import { PromodoroService } from './promodoro.service';

describe('PromodoroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PromodoroService = TestBed.get(PromodoroService);
    expect(service).toBeTruthy();
  });
});
