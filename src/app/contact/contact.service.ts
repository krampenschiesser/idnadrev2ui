import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Thought from '../dto/Thought';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import * as moment from 'moment';
import Contact from '../dto/Contact';
import { RepositoryService } from '../service/repository.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  public contacts = new BehaviorSubject<Contact[]>([]);
  private _contacts: Contact[] = [];
  private dexie: DexieService;
  private persistedFile: PersistedFileService;
  private repositoryService: RepositoryService;

  constructor(dexie: DexieService, persistedFile: PersistedFileService, repositoryService: RepositoryService) {
    this.dexie = dexie;
    this.persistedFile = persistedFile;
    this.repositoryService = repositoryService;
  }

  async loadAllContacts(): Promise<Contact[]> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let openRepositories = this.repositoryService.openRepositories;

    let contacts: Contact[] = [];
    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id, FileType.Contact);
      contacts = contacts.concat(await Promise.all(persisted.map(p => this.persistedFile.toContact(p, repo))));
    }
    this._contacts = contacts;
    this.notifyChanges();
    return contacts;
  }

  notifyChanges() {
    this.contacts.next(this._contacts.slice());
  }

  store(contact: Contact): Promise<string> {
    let repository = this.repositoryService.getRepository(contact.repository);
    return this.dexie.store(contact, repository);
  }

  async delete(contact: Contact): Promise<string> {
    contact.deleted = new Date();
    const id = await this.store(contact);
    this.removeFromList(contact);
    return id;
  }

  async getContact(id: string): Promise<Contact | undefined> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let file = await this.dexie.getById(id);
    if (file) {
      let repository = this.repositoryService.getRepository(file.repositoryId);
      return this.persistedFile.toContact(file, repository);
    }
    return undefined;
  }

  removeFromList(file: Contact) {
    const index = this._contacts.findIndex(contact => contact.id === file.id);
    if (index >= 0) {
      this._contacts.splice(index, 1);
    }
    this.notifyChanges();
  }
}
