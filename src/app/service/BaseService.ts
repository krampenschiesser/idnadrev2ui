import {BehaviorSubject} from "rxjs";
import {DexieService} from "../db/dexie.service";
import {PersistedFileService} from "../db/persisted-file.service";
import {PersistedIdnadrevFile} from "../db/PersistedFiles";
import {FileType} from "../dto/FileType";
import IdnadrevFile from "../dto/IdnadrevFile";
import Repository from "../dto/Repository";

export default class BaseService<T extends IdnadrevFile<any, any>> {
  public files = new BehaviorSubject<T[]>([]);
  private _files: T[] = [];

  constructor(protected repositoryService, protected dexie: DexieService, protected persistedFile: PersistedFileService, protected conversion: (from: PersistedIdnadrevFile, repo: Repository, service: PersistedFileService) => Promise<T>) {
  }


  async loadAll(): Promise<T[]> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let openRepositories = this.repositoryService.openRepositories;

    let files: T[] = [];
    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id, FileType.Contact);
      files = files.concat(await Promise.all(persisted.map(p => this.conversion(p, repo, this.persistedFile))));
    }
    this._files = files;
    this.notifyChanges();
    return files;
  }

  notifyChanges() {
    this.files.next(this._files.slice());
  }

  store(file: T): Promise<string> {
    let repository = this.repositoryService.getRepository(file.repository);
    return this.dexie.store(file, repository);
  }

  async delete(file: T): Promise<string> {
    file.deleted = new Date();
    const id = await this.store(file);
    this.removeFromList(file);
    return id;
  }

  async get(id: string): Promise<T | undefined> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let file = await this.dexie.getById(id);
    if (file) {
      let repository = this.repositoryService.getRepository(file.repositoryId);
      return this.conversion(file, repository, this.persistedFile);
    }
    return undefined;
  }

  removeFromList(file: T) {
    const index = this._files.findIndex(contact => contact.id === file.id);
    if (index >= 0) {
      this._files.splice(index, 1);
    }
    this.notifyChanges();
  }
}