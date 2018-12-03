import { Injectable } from '@angular/core';
import BaseService from './BaseService';
import TaskList from '../dto/TaskList';
import { RepositoryService } from './repository.service';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import { FileId } from '../dto/FileId';

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService<TaskList> {
  constructor(repositoryService: RepositoryService, dexie: DexieService, persistedFile: PersistedFileService) {
    super(repositoryService, dexie, persistedFile, (from, repo, service) => {
      return service.toList(from, repo);
    }, FileType.List);
  }


  async addTasksToList(list: TaskList, fileIds: FileId[]): Promise<string> {
    let set = new Set(list.content);

    fileIds.forEach(id => {
      if (set.has(id)) {
        list.content.push(id);
      }
    });
    return await this.store(list);
  }
}
