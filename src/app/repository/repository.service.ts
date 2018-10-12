import { Injectable } from '@angular/core';
import Repository from '../dto/Repository';
import { RepositoryId } from '../dto/RepositoryId';
import { RepositoryToken } from '../dto/RepositoryToken';
import { DexieService } from '../db/dexie.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistedFileService } from '../db/persisted-file.service';
import Index from '../db/Index';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private dexie: DexieService;
  private persistedFile: PersistedFileService;

  public repositories = new BehaviorSubject<Repository[]>([]);
  private _repositories: Repository[] = [];

  constructor(dexie: DexieService, persistedFile: PersistedFileService) {
    this.dexie = dexie;
    this.persistedFile = persistedFile;
  }

  async loadAllRepositories(): Promise<void> {
    let persistedRepos = await this.dexie.getAllRepos();
    let existingIds = new Set<RepositoryId>(this._repositories.map(r => r.id));
    let repos = persistedRepos.map(r => this.persistedFile.toRepository(r)).filter(r => r !== undefined && !existingIds.has(r.id));
    repos = await Promise.all(repos.map(async r => {
      let item = window.sessionStorage.getItem(r.id);
      if (item && !r.token) {
        await this.openRepositoryHashed(r, item);
      }
      return r;
    }));
    this._repositories.concat(repos);
    this.notifyChanges();
  }

  notifyChanges() {
    this.repositories.next(Array.from(this._repositories));
  }

  get openRepositories(): Observable<Repository[]> {
    return this.repositories.pipe(map(repos => repos.filter(r => r.isOpen())));
  }

  private async openRepositoryHashed(repo: Repository, hash: string): Promise<void> {
    await repo.openWithHash(hash);
    if (repo.token) {
      await this.addIndexes(repo);
    }
  }

  private async addIndexes(repo: Repository) {
    let persistedIndexes = await this.dexie.loadIndexes(repo.id);
    let indexesUndefined: (Index | undefined)[] = await Promise.all(persistedIndexes.map(pi => this.persistedFile.toIndex(pi, repo)));
    let indexes: Index[] = indexesUndefined.filter(f => f !== undefined);
    repo.setIndexes(indexes);
  }


  async createRepository(name: string, pw: string): Promise<Repository> {
    let repository = new Repository(name, pw);
    await this.dexie.storeRepository(repository);
    this._repositories.push(repository);
    this.notifyChanges();
    return repository;
  }

  async openRepository(id: RepositoryId, pw: string): Promise<Repository> {
    const found = this._repositories.find(repo => repo.id === id);
    if (!found) {
      throw 'Repository ' + id + ' not found';
    }
    await found.open(pw);
    this.notifyChanges();
    return found;
  }

  // getToken(id: RepositoryId): RepositoryToken | undefined {
  //   return undefined;
  // }
}