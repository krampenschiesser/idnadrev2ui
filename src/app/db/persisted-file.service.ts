import { Injectable } from '@angular/core';
import IdnadrevFile from '../dto/IdnadrevFile';
import { PersistedBinaryFile, PersistedIdnadrevFile, PersistedIndex, PersistedRepository } from './PersistedFiles';
import Repository from '../dto/Repository';
import Thought from '../dto/Thought';
import Task from '../dto/Task';
import Document from '../dto/Document';
import BinaryFile from '../dto/BinaryFile';
import Index, { indexFromJson } from './Index';

@Injectable({
  providedIn: 'root'
})
export class PersistedFileService {

  constructor() {
  }


  fileDates(file: IdnadrevFile<any, any>) {
    if (typeof file.created === 'string') {
      file.created = new Date(file.created);
    }
    if (typeof file.updated === 'string') {
      file.updated = new Date(file.updated);
    }
    if (typeof file.deleted === 'string') {
      file.deleted = new Date(file.deleted);
    }
  }

  async toThought(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Thought | undefined> {
    if (persisted === undefined) {
      return new Promise<Thought | undefined>(resolve => resolve(undefined));
    }
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    console.log(decrypt);
    let parse = JSON.parse(decrypt);
    let thought = new Thought(parse.name, parse.tags, parse.content);
    Object.assign(thought, parse);
    this.fileDates(thought);
    return thought;
  }

  async toTask(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Task | undefined> {
    if (persisted === undefined) {
      return new Promise<Task | undefined>(resolve => resolve(undefined));
    }
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let task = new Task(parse.name, parse.tags, parse.content);
    Object.assign(task, parse);
    this.fileDates(task);

    if (typeof  task.details.finished === 'string') {
      task.details.finished = new Date(task.details.finished);
    }
    let current = task.details.delegation.current;
    if (current && typeof  current.delegationStarted === 'string') {
      current.delegationStarted = new Date(current.delegationStarted);
    }
    task.details.delegation.history.forEach(h => {
      if (typeof h.delegationStarted === 'string') {
        h.delegationStarted = new Date(h.delegationStarted);
      }
      if (typeof h.delegationEnded === 'string') {
        h.delegationEnded = new Date(h.delegationEnded);
      }
    });
    if (task.details.schedule) {
      let fixedScheduling = task.details.schedule.fixedScheduling;
      if (fixedScheduling && typeof fixedScheduling.scheduledDateTime === 'string') {
        fixedScheduling.scheduledDateTime = new Date(fixedScheduling.scheduledDateTime);
      }
      let proposedDate = task.details.schedule.proposedDate;
      if (proposedDate && typeof proposedDate.proposedDateTime === 'string') {
        proposedDate.proposedDateTime = new Date(proposedDate.proposedDateTime);
      }
      task.details.workUnits.forEach(unit => {
        if (typeof unit.start === 'string') {
          unit.start = new Date(unit.start);
        }
        if (typeof unit.end === 'string') {
          unit.end = new Date(unit.end);
        }
      });
    }

    return task;
  }

  async toDocument(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Document | undefined> {
    if (persisted === undefined) {
      return new Promise<Document | undefined>(resolve => resolve(undefined));
    }
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let doc = new Document(parse.name, parse.tags, parse.content);
    Object.assign(doc, parse);
    this.fileDates(doc);
    return doc;
  }

  async toBinaryFile(persisted: PersistedBinaryFile | undefined, repo: Repository): Promise<BinaryFile | undefined> {
    if (persisted === undefined) {
      return new Promise<BinaryFile | undefined>(resolve => resolve(undefined));
    }
    let decryptJson = await repo.decryptToText(persisted.data, persisted.nonce);
    let decryptContent = await repo.decrypt(persisted.dataBinary, persisted.nonceBinary);
    let parse = JSON.parse(decryptJson);
    let file = new BinaryFile(parse.name, parse.tags);
    Object.assign(file, parse);
    this.fileDates(file);
    file.content = decryptContent;
    return file;
  }

  toRepository(persisted: PersistedRepository): Repository | undefined {
    if (persisted === undefined) {
      return undefined;
    }
    let repository = new Repository(persisted.name, '');
    repository.id = persisted.id;
    repository.nonce = persisted.nonce;
    repository.data = persisted.data;
    repository.salt = persisted.salt;
    return repository;
  }


  async toIndex(persisted: PersistedIndex | undefined, repo: Repository): Promise<Index | undefined> {
    if (persisted === undefined) {
      return new Promise<Index | undefined>(resolve => resolve(undefined));
    }
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let idx = indexFromJson(persisted.type, decrypt);
    return idx;
  }
}
