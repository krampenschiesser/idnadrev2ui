import { Injectable } from '@angular/core';
import Repository from '../dto/Repository';
import { RepositoryId } from '../dto/RepositoryId';
import { DexieService } from '../db/dexie.service';
import { BehaviorSubject } from 'rxjs';
import { PersistedFileService } from '../db/persisted-file.service';
import Index from '../db/Index';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private dexie: DexieService;
  private persistedFile: PersistedFileService;

  public repositories = new BehaviorSubject<Repository[]>([]);
  _repositories: Repository[] = [];

  constructor(dexie: DexieService, persistedFile: PersistedFileService) {
    this.dexie = dexie;
    this.persistedFile = persistedFile;
  }

  async waitLoadAllRepositoriesOnce(): Promise<void> {
    if (this._repositories.length === 0) {
      await this.loadAllRepositories();
    }
  }

  async loadAllRepositories(): Promise<void> {
    let persistedRepos = await this.dexie.getAllRepos();
    let repos = persistedRepos.map(r => this.persistedFile.toRepository(r)).filter(r => r !== undefined);
    repos = await Promise.all(repos.map(async r => {
      let item = window.sessionStorage.getItem(r.id);
      if (item && !r.token) {
        await this.openRepositoryHashed(r, item);
      }
      return r;
    }));
    let existingIds = new Set<RepositoryId>(this._repositories.map(r => r.id));
    repos = repos.filter(r => !existingIds.has(r.id));
    this._repositories = this._repositories.concat(repos);
    this.notifyChanges();
  }

  notifyChanges() {
    this.repositories.next(Array.from(this._repositories));
  }

  get openRepositories(): Repository[] {
    return this._repositories.filter(r => r.isOpen());
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
  logout(id: RepositoryId) {
    const found = this.getRepository(id);
    found.logout();
    this.notifyChanges();
  }

  getRepository(repositoryId: RepositoryId) {
    const found = this._repositories.find(repo => repo.id === repositoryId);
    if (!found) {
      throw 'Repository ' + repositoryId + ' not found';
    }
    return found;
  }
}
