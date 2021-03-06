import { Component } from '@angular/core';
import { DexieService } from './db/dexie.service';
import * as waitUntil from 'async-wait-until';
import { generateBinaryFiles, generateContacts, generateList, generateRepositories, generateTasks, generateTemplates, generateThoughts } from './db/DummyData';
import { isAvailable } from 'rasm-crypt';
import { MessageService } from 'primeng/api';
import { DisplayService } from './service/display.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sideBarVisible = true;

  constructor(private dexie: DexieService, public display: DisplayService) {
  }

  async createDummyData() {
    await waitUntil(isAvailable, 5000, 50);
    console.log('start creating dummy data');
    try {
      let repos = generateRepositories();
      await Promise.all(repos.map(r => this.dexie.storeRepository(r)));
      let repo = repos[0];
      await Promise.all(generateThoughts(repo.id).map(t => this.dexie.store(t, repo)));
      let contacts = generateContacts(repo.id);
      await Promise.all(contacts.map(t => this.dexie.store(t, repo)));
      let tasks = generateTasks(repo.id, contacts);
      await Promise.all(tasks.map(t => this.dexie.store(t, repo)));
      let tasksWithTags = tasks.filter(t => t.tags.length > 0);
      await Promise.all(generateList(tasksWithTags, repo.id).map(t => this.dexie.store(t, repo)));
      await Promise.all(generateBinaryFiles(repo.id).map(t => this.dexie.storeBinaryFile(t, repo)));
      await Promise.all(generateTemplates(repo.id).map(t => this.dexie.store(t, repo)));
      // generateManyTasks().forEach(t => this.store(t));
      console.log('done creating dummy data');
   alert('created dummy data')
    } catch (e) {
      console.log('Could not create dummy data', e);
      throw e;
    }
  }

  async clear() {
    await this.dexie.deleteData();
    alert('deleted db');
  }
}
