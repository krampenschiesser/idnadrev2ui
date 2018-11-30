import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import BaseService from './BaseService';
import Template from '../dto/Template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends BaseService<Template> {
  constructor(repositoryService: RepositoryService, dexie: DexieService, persistedFile: PersistedFileService) {
    super(repositoryService, dexie, persistedFile, (from, repo, service) => {
      return service.toTemplate(from, repo);
    }, FileType.Template);
  }
}
