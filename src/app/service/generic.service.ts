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

  promodoro?: Promodoro;

  async getPromodoro(): Promise<Promodoro> {
    if (this._files.length == 0) {
      await this.loadAll();
    }
    let found = this._files.find(f => f.id === 'promodoro');
    if (found) {
      this.promodoro = new Promodoro(found);
      console.log('found promodoro', found);
      return this.promodoro;
    } else {
      let promodoro = new Promodoro();
      this.storePromodoro(promodoro);
      this.promodoro = promodoro;
      console.log('generated promodoro', this.promodoro);
      return promodoro;
    }
  }

  storePromodoro(promodoro: Promodoro) {
    let openRepositories = this.repositoryService.openRepositories;
    if (openRepositories.length > 0) {
      let generic = promodoro.toGeneric();
      generic.repository = openRepositories[0].id;
      generic.id = 'promodoro';
      console.log('storing promodoro', generic);
      return this.store(generic);
    } else {
      return new Promise(r => r('-1'));
    }
  }

  startPromodoro(promodoro: Promodoro) {
    promodoro.start();
    this.storePromodoro(promodoro);
  }

  stopPromodoro(promodoro: Promodoro) {
    promodoro.stop();
    this.storePromodoro(promodoro);
  }
}
