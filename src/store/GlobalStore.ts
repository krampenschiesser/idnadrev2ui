import { observable } from 'mobx';
import { FileId } from '../dto/FileId';
import IdnadrevFile from '../dto/IdnadrevFile';
import Repository from '../dto/Repository';
import { RepositoryId } from '../dto/RepositoryId';
import Task, { TaskContext } from '../dto/Task';
import Thought from '../dto/Thought';
import FileFilter from './FileFilter';
import { TaskFilter } from './TaskFilter';
import WebStorage from './WebStorage';
import BinaryFile from '../dto/BinaryFile';

export default class GlobalStore {
  colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  assignedColors: Map<string, string> = new Map();
  @observable lastSelectedRepository: RepositoryId | null = null;
  webStorage: WebStorage;

  @observable repositories: Repository[] = [];
  @observable openRepositories: Repository[] = [];

  constructor(webStorage: WebStorage) {
    this.webStorage = webStorage;
    // this.webStorage.getInitialTags().then(tags => {
    //   tags.forEach(tag => this.tags.set(tag.name, tag));
    // }).catch(e => console.error('Could not load tags %o', e));
    // this.webStorage.getAllContexts().then(contexts => {
    //   contexts.forEach(ctx => this.contexts.set(ctx, ctx));
    // }).catch(e => console.error('Could not load contexts %o', e));
    this.webStorage.whenLoaded().then(() => {
      this.loadRepositories();
    });
  }

  getAllContexts(): TaskContext[] {
    let contexts: Set<TaskContext> = new Set();
    this.openRepositories.map(repo => repo.getContextIndex.getAllValues()).forEach(values => values.forEach(value => {
      if (value) {
        contexts.add(value);
      }
    }));
    return Array.from(contexts);
  }

  getTagsStartingWith(input: string): string[] {
    input = input.toLocaleLowerCase();
    let tags: Set<string> = new Set();
    this.openRepositories.map(repo => repo.getTagIndex.getAllValues()).forEach(values => values.forEach(value => {
      if (value && value.name.toLocaleLowerCase().includes(input)) {
        tags.add(value.name);
      }
    }));
    return Array.from(tags);
  }

  getTagColor(tag: string): string {
    let newVar = this.assignedColors.get(tag);
    if (newVar === undefined) {
      let index = Math.floor(Math.random() * this.colors.length);
      let color = this.colors[index];
      this.assignedColors.set(tag, color);
      return color;
    } else {
      return newVar;
    }
  }

  async getOpenThoughts(): Promise<Thought[]> {
    let repos = this.openRepositories;
    let thoughts: Thought[] = [];
    for (const repo of repos) {
      console.log('Loading from repo', repo);
      let cur = await this.webStorage.loadOpenThoughts(repo);
      cur.forEach(t => thoughts.push(t));
    }
    console.log('loaded thoughts', thoughts);
    return thoughts;
  }

  async getTasks(filter?: TaskFilter): Promise<Task[]> {
    let repos = this.openRepositories;
    let tasks: Task[] = [];
    for (const repo of repos) {
      let cur = await this.webStorage.getTasks(repo, filter);
      cur.forEach(t => tasks.push(t));
    }
    return tasks;
  }

  async getAllFiles(fileFilter?: FileFilter): Promise<IdnadrevFile<{}, {}>[]> {
    let repos = this.openRepositories;
    let files: IdnadrevFile<{}, {}>[] = [];
    for (const repo of repos) {
      let cur = await this.webStorage.getAllFiles(repo, fileFilter);
      cur.forEach(t => files.push(t));
    }
    return files;
  }

  async getTask(parent: FileId, repoId: RepositoryId): Promise<Task | undefined> {
    let filtered = this.openRepositories.filter(r => r.id === repoId);
    if (filtered.length === 0) {
      return undefined;
    } else {
      let repo = filtered[0];
      return this.webStorage.loadTaskById(parent, repo);
    }
  }

  loadRepositories(): Promise<Repository[]> {
    if (this.repositories.length === 0) {
      return this.webStorage.getRepositories().then(repos => {
        repos.forEach(r => {
          let item = window.sessionStorage.getItem(r.id);
          if (item && !this.openRepositories.find(openRepo => openRepo.id === r.id)) {
            this.openRepositoryHashed(r, item);
          }
        });
        this.repositories = repos;

        return repos;
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(this.repositories);
      });
    }
  }

  getRepository(repoId: RepositoryId): Repository | undefined {
    let index = this.repositories.findIndex(r => r.id === repoId);
    if (index >= 0) {
      return this.repositories[index];
    } else {
      return undefined;
    }
  }

  async openRepository(repo: Repository, pw: string): Promise<void> {
    await repo.open(pw);
    if (repo.token) {
      let indexes = await this.webStorage.loadIndexes(repo);
      repo.setIndexes(indexes);
      console.log('push repo open');
      this.openRepositories.push(repo);
    }
  }

  async openRepositoryHashed(repo: Repository, hash: string): Promise<void> {
    await repo.openWithHash(hash);
    if (repo.token) {
      let indexes = await this.webStorage.loadIndexes(repo);
      repo.setIndexes(indexes);
      console.log('push repo ' + repo.name + ' hashed');
      if (!this.openRepositories.find(openRepo => openRepo.id === repo.id)) {
        this.openRepositories.push(repo);
      }
    }
  }

  getContexts(): Set<TaskContext> {
    let set: Set<TaskContext> = new Set();
    this.openRepositories.forEach(repo => repo.getContextIndex.getAllValues().forEach(context => {
      if (context) {
        set.add(context);
      }
    }));
    return set;
  }

  markDeleted(file: IdnadrevFile<any, any>): Promise<string> {
    file.deleted = new Date();
    let repo = this.getRepository(file.repository);
    if (repo) {
      return this.webStorage.store(file, repo);
    } else {
      return new Promise((resolve, reject) => reject('No repository'));
    }
  }

  store(file: IdnadrevFile<any, any>): Promise<string> {
    let repo = this.getRepository(file.repository);
    if (repo) {
      if (file instanceof BinaryFile) {
        return this.webStorage.storeBinaryFile(file, repo);
      } else {
        return this.webStorage.store(file, repo);
      }
    } else {
      return new Promise((resolve, reject) => reject('No repository found for ' + file.repository));
    }
  }

}
