import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import Thought from '../dto/Thought';
import { FileType } from '../dto/FileType';
import * as moment from 'moment';
import { RepositoryService } from '../service/repository.service';

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

  async loadAllThoughts(): Promise<Thought[]> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let openRepositories = this.repositoryService.openRepositories;

    let thoughts: Thought[] = [];
    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id, FileType.Thought);
      thoughts = thoughts.concat(await Promise.all(persisted.map(p => this.persistedFile.toThought(p, repo))));
    }
    this._thoughts = thoughts;
    this.notifyChanges();
    return thoughts;
  }

  notifyChanges() {
    this.thoughts.next(this._thoughts.slice());
  }

  store(thought: Thought): Promise<string> {
    let repository = this.repositoryService.getRepository(thought.repository);
    return this.dexie.store(thought, repository);
  }

  async delete(thought: Thought): Promise<string> {
    thought.deleted = new Date();
    const id = await this.store(thought);
    this.removeFromList(thought);
    return id;
  }

  async postpone(thought: Thought, days: number): Promise<string> {
    thought.details.showAgainAfter = moment().add(days, 'd').toDate();
    const id = await this.store(thought);
    await this.loadAllThoughts();
    return id;
  }

  async getThought(id: string): Promise<Thought | undefined> {
    let file = await this.dexie.getById(id);
    if (file) {
      let repository = this.repositoryService.getRepository(file.repositoryId);
      return this.persistedFile.toThought(file, repository);
    }
    return undefined;
  }

  removeFromList(file: Thought) {
    const index = this._thoughts.findIndex(thought => thought.id === file.id);
    if (index >= 0) {
      this._thoughts.splice(index, 1);
    }
    this.notifyChanges();
  }
}
