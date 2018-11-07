import {Injectable} from '@angular/core';
import {DexieService} from '../db/dexie.service';
import {PersistedFileService} from '../db/persisted-file.service';
import Contact from '../dto/Contact';
import BaseService from "./BaseService";
import { FileType } from '../dto/FileType';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService<Contact> {

  constructor(repositoryService: RepositoryService, dexie: DexieService, persistedFile: PersistedFileService) {
    super(repositoryService, dexie, persistedFile, (from, repo, service) => {
      return service.toContact(from, repo);
    },FileType.Contact);
  }
}
