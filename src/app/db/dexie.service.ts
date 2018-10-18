import { Injectable, isDevMode } from '@angular/core';
import Dexie from 'dexie';
import { PersistedBinaryFile, PersistedIdnadrevFile, PersistedIndex, PersistedRepository } from './PersistedFiles';
import { PersistedFileService } from './persisted-file.service';
import Index, { IndexUpdateState } from './Index';
import Repository from '../dto/Repository';
import BinaryFile from '../dto/BinaryFile';
import IdnadrevFile from '../dto/IdnadrevFile';
import { FileType } from '../dto/FileType';
import { FileId } from '../dto/FileId';
import { RepositoryId } from '../dto/RepositoryId';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  static populate = isDevMode();
  private files: Dexie.Table<PersistedIdnadrevFile, string>;
  private repositories: Dexie.Table<PersistedRepository, string>;
  private indexes: Dexie.Table<PersistedIndex, string>;
  private persistedFileService: PersistedFileService;

  constructor(persistedFileService: PersistedFileService) {
    super('idnadrevdb');
    this.persistedFileService = persistedFileService;
    this.version(1).stores({
      files: 'id, repositoryId, type',
      repositories: 'id, name',
      indexes: 'id, repositoryId'
    });
  }


  async storeIndex(index: Index, repo: Repository): Promise<string> {
    console.log("storing index")
    let [encrypted, nonce] = await repo.encrypt(index.toJson());
    let data: PersistedIndex = {
      data: encrypted,
      nonce: nonce,
      id: index.id,
      repositoryId: index.repo,
      type: index.getType()
    };
    return this.indexes.put(data);
  }

  async storeRepository(obj: Repository): Promise<string> {
    console.log('storing repository', obj.name);
    let data = this.persistedFileService.toPersistedRepo(obj);
    await Promise.all(obj.indexes.map(i => this.storeIndex(i, obj)));
    console.log('stored repository', obj.name);
    return this.repositories.put(data);
  }

  async storeBinaryFile(obj: BinaryFile, repo: Repository) {
    console.log('storing %o', obj);
    let assign: BinaryFile = Object.assign({}, obj);
    assign.content = Uint8Array.of();

    let [encryptedJson, nonceJson] = await repo.encrypt(JSON.stringify(assign));
    let [encryptedContent, nonceContent] = await repo.encrypt(obj.content);

    let data: PersistedBinaryFile = {
      dataBinary: encryptedContent,
      data: encryptedJson,
      nonceBinary: nonceContent,
      nonce: nonceJson,
      id: obj.id,
      repositoryId: obj.repository,
      type: obj.fileType,
      deleted: obj.isDeleted
    };
    await this.updateIndexes(repo, obj);
    return this.files.put(data);
  }

  async store<T extends IdnadrevFile<any, any>>(obj: T, repo: Repository): Promise<string> {
    let json = JSON.stringify(obj);
    let [encrypted, nonce] = await repo.encrypt(json);
    let data: PersistedIdnadrevFile = {
      data: encrypted,
      nonce: nonce,
      id: obj.id,
      repositoryId: obj.repository,
      type: obj.fileType,
      deleted: obj.isDeleted
    };
    await this.updateIndexes(repo, obj);
    return this.files.put(data);
  }

  async updateIndexes(repo: Repository, obj: IdnadrevFile<any, any>): Promise<string> {
    await Promise.all(repo.indexes.map(async i => {
      if (i.onUpdate(obj) === IndexUpdateState.CHANGED) {
        return await this.storeIndex(i, repo);
      } else {
        return 'no change';
      }
    }));
    return 'ok';
  }

  async deleteFromIndexes(repo: Repository, obj: IdnadrevFile<any, any>): Promise<string> {
    await Promise.all(repo.indexes.map(async i => {
      if (i.onDelete(obj) === IndexUpdateState.CHANGED) {
        return await this.storeIndex(i, repo);
      } else {
        return 'no change';
      }
    }));
    return 'ok';
  }


  getAllRepos(): Promise<PersistedRepository[]> {
    return this.repositories.toArray();
  }

  getAllNonDeleted(repositoryId: RepositoryId, type: FileType): Promise<PersistedIdnadrevFile[]> {
    return this.files.where('type').equals(type).and(f => f.repositoryId == repositoryId).and(f => !f.deleted).toArray();
  }

  getById(id: FileId): Promise<PersistedIdnadrevFile | undefined> {
    return this.files.where('id').equals(id).first();
  }

  loadIndexes(repositoryId: RepositoryId): Promise<PersistedIndex[]> {
    return this.indexes.where('repositoryId').equals(repositoryId).toArray();
  }
}
