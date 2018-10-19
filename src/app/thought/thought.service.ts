import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import Thought from '../dto/Thought';
import { RepositoryId } from '../dto/RepositoryId';
import { RepositoryService } from '../repository/repository.service';
import { FileType } from '../dto/FileType';
import { PersistedIdnadrevFile } from '../db/PersistedFiles';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {

  public thoughts = new BehaviorSubject<Thought[]>([]);
  private _thoughts: Thought[] = [];
  private dexie: DexieService;
  private persistedFile: PersistedFileService;
  private repositoryService: RepositoryService;

  constructor(dexie: DexieService, persistedFile: PersistedFileService, repositoryService: RepositoryService) {
    this.dexie = dexie;
    this.persistedFile = persistedFile;
    this.repositoryService = repositoryService;
  }

  async loadAllOpenThoughts(): Promise<Thought[]> {
    await this.repositoryService.loadAllRepositories();
    let openRepositories = this.repositoryService.openRepositories;

    let thoughts: Thought[] = [];
    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id, FileType.Thought);
      thoughts = thoughts.concat(await Promise.all(persisted.map(p => this.persistedFile.toThought(p, repo))));
    }
    thoughts = thoughts.filter(t => !t.isPostPoned);
    this._thoughts = thoughts;
    this.notifyChanges();
    return thoughts;
  }

  notifyChanges() {
    this.thoughts.next(Array.from(this._thoughts));
  }

}
