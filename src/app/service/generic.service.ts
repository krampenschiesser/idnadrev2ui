import { Injectable } from '@angular/core';
import BaseService from './BaseService';
import Contact from '../dto/Contact';
import { RepositoryService } from './repository.service';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import Generic from '../dto/Generic';
import Promodoro from '../dto/generic/Promodoro';

@Injectable({
  providedIn: 'root'
})
export class GenericService extends BaseService<Generic> {
  constructor(repositoryService: RepositoryService, dexie: DexieService, persistedFile: PersistedFileService) {
    super(repositoryService, dexie, persistedFile, (from, repo, service) => {
      return service.toGeneric(from, repo);
    }, FileType.Generic);
  }

  async getPromodoro(): Promise<Promodoro> {
    if (this._files.length == 0) {
      await this.loadAll();
    }
    let found = this._files.find(f => f.name === 'promodoro');
    if (found) {
      return new Promodoro(found);
    } else {
      let promodoro = new Promodoro();
      let generic = promodoro.toGeneric();
      await this.store(generic);
      return promodoro;
    }
  }

  storePromodoro(promodoro: Promodoro) {
    let generic = promodoro.toGeneric();
    return this.store(generic);
  }
}
