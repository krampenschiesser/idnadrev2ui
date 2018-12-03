import { Injectable } from '@angular/core';
import IdnadrevFile from '../dto/IdnadrevFile';
import { PersistedBinaryFile, PersistedIdnadrevFile, PersistedIndex, PersistedRepository } from './PersistedFiles';
import Repository from '../dto/Repository';
import Thought from '../dto/Thought';
import Task from '../dto/Task';
import Document from '../dto/Document';
import BinaryFile from '../dto/BinaryFile';
import Index from './Index';
import { indexFromJson } from './IndexFromJson';
import Contact from '../dto/Contact';
import Template from '../dto/Template';
import TaskList from '../dto/TaskList';
import Generic from '../dto/Generic';

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

  async toThought(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Thought> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let thought = new Thought(parse.name, parse.tags, parse.content);
    Object.assign(thought, parse);
    this.fileDates(thought);
    return thought;
  }

  async toGeneric(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Generic> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let generic = new Generic(parse.name);
    Object.assign(generic, parse);
    this.fileDates(generic);
    return generic;
  }

  async toTask(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Task> {
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

  async toDocument(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Document> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let doc = new Document(parse.name, parse.tags, parse.content);
    Object.assign(doc, parse);
    this.fileDates(doc);
    return doc;
  }

  async toTemplate(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Template> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let doc = new Template(parse.name, parse.tags);
    Object.assign(doc, parse);
    this.fileDates(doc);
    return doc;
  }

  async toList(persisted: PersistedIdnadrevFile, repo: Repository): Promise<TaskList> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let doc = new TaskList(parse.name, parse.tags);
    Object.assign(doc, parse);
    this.fileDates(doc);
    return doc;
  }

  async toContact(persisted: PersistedIdnadrevFile, repo: Repository): Promise<Contact> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let parse = JSON.parse(decrypt);
    let doc = new Contact(parse.name, parse.tags);
    Object.assign(doc, parse);
    if (doc.details.birthday && typeof doc.details.birthday === 'string') {
      doc.details.birthday = new Date(doc.details.birthday);
    }
    this.fileDates(doc);
    return doc;
  }

  async toBinaryFile(persisted: PersistedBinaryFile, repo: Repository): Promise<BinaryFile> {
    let decryptJson = await repo.decryptToText(persisted.data, persisted.nonce);
    let decryptContent = await repo.decrypt(persisted.dataBinary, persisted.nonceBinary);
    let parse = JSON.parse(decryptJson);
    let file = new BinaryFile(parse.name, parse.tags);
    Object.assign(file, parse);
    this.fileDates(file);
    file.content = decryptContent;
    return file;
  }

  toRepository(persisted: PersistedRepository): Repository {
    let repository = new Repository(persisted.name, '');
    repository.id = persisted.id;
    repository.nonce = persisted.nonce;
    repository.data = persisted.data;
    repository.salt = persisted.salt;
    return repository;
  }


  async toIndex(persisted: PersistedIndex, repo: Repository): Promise<Index> {
    let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
    let idx = indexFromJson(persisted.type, decrypt);
    return idx;
  }

  toPersistedRepo(obj: Repository): PersistedRepository {
    let data: PersistedRepository = {
      data: obj.data,
      nonce: obj.nonce,
      salt: obj.salt,
      id: obj.id,
      name: obj.name,
    };
    return data;
  }
}
