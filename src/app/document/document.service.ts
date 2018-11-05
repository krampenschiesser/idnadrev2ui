import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Thought from '../dto/Thought';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import Document from '../dto/Document';
import IdnadrevFile from '../dto/IdnadrevFile';
import Task from '../dto/Task';
import BinaryFile from '../dto/BinaryFile';
import { PersistedBinaryFile } from '../db/PersistedFiles';
import { ThoughtService } from '../thought/thought.service';
import { TaskService } from '../task/task.service';
import { RepositoryService } from '../service/repository.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {


  public files = new BehaviorSubject<IdnadrevFile<any, any>[]>([]);
  private _files: IdnadrevFile<any, any>[] = [];

  constructor(private dexie: DexieService, private persistedFile: PersistedFileService, private repositoryService: RepositoryService, private thoughtService: ThoughtService, private taskService: TaskService) {
  }

  async allFiles(): Promise<IdnadrevFile<any, any>[]> {

    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let openRepositories = this.repositoryService.openRepositories;

    let files: IdnadrevFile<any, any>[] = [];
    let documents: Document[] = [];
    let tasks: Task[] = [];
    let thoughts: Thought[] = [];
    let binaryFiles: BinaryFile[] = [];

    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id);
      documents = documents.concat(await Promise.all(persisted.filter(p => p.type === FileType.Document).map(p => this.persistedFile.toDocument(p, repo))));
      tasks = tasks.concat(await Promise.all(persisted.filter(p => p.type === FileType.Task).map(p => this.persistedFile.toTask(p, repo))));
      thoughts = thoughts.concat(await Promise.all(persisted.filter(p => p.type === FileType.Thought).map(p => this.persistedFile.toThought(p, repo))));
      // @ts-ignore
      binaryFiles = binaryFiles.concat(await Promise.all(persisted.filter(p => p.type === FileType.Binary).map(p => this.persistedFile.toBinaryFile(p, repo))));
      files = files.concat(documents, tasks, thoughts, binaryFiles);
    }
    this._files = files;
    this.notifyChanges();
    return thoughts;
  }

  notifyChanges() {
    this.files.next(this._files.slice());
  }

  store(doc: Document): Promise<string> {
    let repository = this.repositoryService.getRepository(doc.repository);
    return this.dexie.store(doc, repository);
  }

  async delete(doc: Document): Promise<string> {
    doc.deleted = new Date();
    const id = await this.store(doc);
    const index = this._files.findIndex(thought => thought.id === doc.id);
    if (index >= 0) {
      this._files.splice(index, 1);
    }
    this.notifyChanges();
    return id;
  }

  async deleteFile(file: IdnadrevFile<any, any>): Promise<string> {
    file.deleted = new Date();
    let repository = this.repositoryService.getRepository(file.repository);
    const id = this.dexie.store(file, repository);

    const index = this._files.findIndex(f => f.id === file.id);
    if (index >= 0) {
      this._files.splice(index, 1);
    }
    this.notifyChanges();
    if (file instanceof Thought) {
      this.thoughtService.removeFromList(file);
    } else if (file instanceof Task) {
      this.taskService.removeFromList(file);
    }
    return id;
  }

  async getDoc(id: string): Promise<Document | undefined> {
    let file = await this.dexie.getById(id);
    if (file) {
      let repository = this.repositoryService.getRepository(file.repositoryId);
      return this.persistedFile.toDocument(file, repository);
    }
    return undefined;
  }
}
