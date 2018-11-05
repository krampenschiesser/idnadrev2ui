import { TestBed } from '@angular/core/testing';

import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import Repository from '../dto/Repository';
import * as waitUntil from 'async-wait-until';
import { isAvailable } from 'rasm-crypt';
import { RepositoryService } from './repository.service';

describe('RepositoryService', () => {
  beforeAll(async () => {
    await waitUntil(() => isAvailable(), 5000, 50);
  });

  it('should be created', () => {
    TestBed.configureTestingModule({});
    const service: RepositoryService = TestBed.get(RepositoryService);
    expect(service).toBeTruthy();
  });

  it('loadAllRepos', async () => {
    let repo1 = new PersistedFileService().toPersistedRepo(new Repository('test1', 'test'));
    let repo2 = new PersistedFileService().toPersistedRepo(new Repository('test2', 'test'));
    let repos = [repo1, repo2];
    let spy = jasmine.createSpyObj('DexieService', {'getAllRepos': repos});
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        RepositoryService,
        {provide: DexieService, useValue: spy}
      ]
    });

    const service: RepositoryService = TestBed.get(RepositoryService);
    await service.loadAllRepositories();
    expect(service.repositories.getValue().length).toEqual(2);
  });
});
