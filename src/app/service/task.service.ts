import { Injectable } from '@angular/core';
import Task from '../dto/Task';
import { BehaviorSubject } from 'rxjs';
import { DexieService } from '../db/dexie.service';
import { PersistedFileService } from '../db/persisted-file.service';
import { FileType } from '../dto/FileType';
import { FileId } from '../dto/FileId';
import { RepositoryService } from './repository.service';
import TaskList from '../dto/TaskList';
import { filterTasks } from '../task-filter/task-filter/TaskFilter';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasks = new BehaviorSubject<Map<FileId, Task>>(new Map<FileId, Task>());
  private _tasks = new Map<FileId, Task>();
  private _allStates = [];
  private _allDelegations = [];

  constructor(private dexie: DexieService, private persistedFile: PersistedFileService, private repositoryService: RepositoryService) {
  }

  loadAllTasksOnce(): Promise<Task[]> {
    if (this._tasks.size == 0) {
      return this.loadAllTasks();
    } else {
      let tasks1: Task[] = Array.from(this._tasks.values());
      return new Promise<Task[]>(r => r(tasks1));
    }
  }

  async loadAllTasks(): Promise<Task[]> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    let openRepositories = this.repositoryService.openRepositories;

    let tasks: Task[] = [];

    for (let repo of openRepositories) {
      let persisted = await this.dexie.getAllNonDeleted(repo.id, FileType.Task);
      tasks = tasks.concat(await Promise.all(persisted.filter(p => p.type === FileType.Task).map(p => this.persistedFile.toTask(p, repo))));
    }
    tasks.forEach(t => this._tasks.set(t.id, t));
    tasks.filter(t => t.parent).forEach(t => this._tasks.get(t.parent).addChild(t));
    this.notifyChanges();
    return tasks;
  }

  async loadAllTaskStates() {
    this._allStates.splice(0);
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    this.repositoryService.openRepositories.map(r => r.getTaskStateIndex.getAllValues()).forEach(given => {
      for (let tag of Array.from(given)) {
        if (tag) {
          if (this._allStates.findIndex(t => t.toLocaleLowerCase() === tag.toLocaleLowerCase()) == -1) {
            this._allStates.push(tag);
          }
        }
      }
    });
  }

  async loadAllTaskDelegations() {
    this._allDelegations.splice(0);
    await this.repositoryService.waitLoadAllRepositoriesOnce();
    this.repositoryService.openRepositories.map(r => r.getDelegationIndex.getAllValues()).forEach(given => {
      for (let delegation of Array.from(given)) {
        if (delegation) {
          if (this._allDelegations.findIndex(t => t.toLocaleLowerCase() === delegation.toLocaleLowerCase()) == -1) {
            this._allDelegations.push(delegation);
          }
        }
      }
    });
  }

  notifyChanges() {
    let map = new Map(this._tasks.entries());
    this.tasks.next(map);
  }

  async store(task: Task): Promise<string> {
    let repository = this.repositoryService.getRepository(task.repository);
    let id = await this.dexie.store(task, repository);
    if (!this._tasks.has(task.id)) {
      this._tasks.set(task.id, task);
      this.notifyChanges();
    }
    return id;
  }

  async delete(task: Task): Promise<string> {
    task.deleted = new Date();
    const id = await this.store(task);
    this.removeFromListAndNotify(task);
    return id;
  }

  async deleteAll(tasks: Task[]): Promise<string[]> {
    tasks.forEach(t => t.deleted = new Date());

    let stored = await Promise.all(tasks.map(t => this.store(t)));
    tasks.forEach(t => this.removeFromList(t));
    this.notifyChanges();
    return stored;
  }

  async finishAll(tasks: Task[]): Promise<string[]> {
    tasks.forEach(t => t.details.finished = new Date());
    let stored = await Promise.all(tasks.map(t => this.store(t)));
    this.notifyChanges();
    return stored;
  }

  async getTask(id: string): Promise<Task | undefined> {
    await this.repositoryService.waitLoadAllRepositoriesOnce();

    if (this._tasks.has(id)) {
      return this._tasks.get(id);
    }
    let file = await this.dexie.getById(id);
    if (file) {
      let repository = this.repositoryService.getRepository(file.repositoryId);
      let task = await this.persistedFile.toTask(file, repository);
      this._tasks.set(task.id, task);
      return task;
    }
    return undefined;
  }

  removeFromListAndNotify(file: Task) {
    this.removeFromList(file);
    this.notifyChanges();
  }

  private removeFromList(file: Task) {
    Array.from(this._tasks.values()).forEach(t => {
      if (t.children) {
        let index = t.children.indexOf(t);
        if (index >= 0) {
          t.children.splice(index, 1);
        }
      }
    });
    this._tasks.delete(file.id);
  }

  async finishTask(task: Task): Promise<string> {
    task.details.finished = new Date();
    task.stopWork();
    await this.store(task);
    this.notifyChanges();
    return task.id;
  }

  get states(): string[] {
    return this._allStates.slice();
  }

  get delegations(): string[] {
    return this._allDelegations.slice();
  }

  async stopWork(task: Task): Promise<string> {
    task.stopWork();
    await this.store(task);
    this.notifyChanges();
    return task.id;
  }

  async startWork(task: Task): Promise<string> {
    task.startWork();
    await this.store(task);
    this.notifyChanges();
    return task.id;
  }

  async getTasksForList(list: TaskList): Promise<Task[]> {
    await this.loadAllTasksOnce();
    let filter = list.details.filter;
    if (filter) {
      return filterTasks(filter, this._tasks, false);
    } else {
      return list.content.map(id => this._tasks.get(id));
    }
  }

  async getScheduledTasks(start: moment.Moment, end: moment.Moment): Promise<Task[]> {
    await this.loadAllTasksOnce();
    let retval = Array.from(this._tasks.values())
      .filter(t => {
        return !!t.details.schedule;
      })
      .filter(t => {
        return t.details.schedule.isScheduled();
      })
      .filter(t => {
        let startDate = moment(t.details.schedule.getStartDate());
        let endDate = moment(t.details.schedule.getEndDate(t.details.estimatedTime));
        let startIsIn = startDate.isBetween(start, end);
        let endIsIn = endDate.isBetween(start, end);
        let isInRange = startIsIn || endIsIn;

        let spansOverRange = startDate.isSameOrBefore(start) && endDate.isSameOrAfter(end);
        return isInRange || spansOverRange;
      });
    return retval;
  }
}
