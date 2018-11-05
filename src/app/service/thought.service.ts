import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import Thought from '../dto/Thought';
import { FileType } from '../dto/FileType';
import * as moment from 'moment';
import BaseService from "./BaseService";
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService extends BaseService<Thought>{


  constructor(repositoryService, dexie: DexieService, persistedFile: PersistedFileService) {
    super(repositoryService, dexie, persistedFile, (from, repo, service) => {
      return service.toThought(from, repo);
    });
  }

  async postpone(thought: Thought, days: number): Promise<string> {
    thought.details.showAgainAfter = moment().add(days, 'd').toDate();
    const id = await this.store(thought);
    return id;
  }
}
