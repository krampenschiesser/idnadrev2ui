import Repository from '../dto/Repository';
import { observable } from 'mobx';
import { RepositoryId } from '../dto/RepositoryId';
import WebStorage from './WebStorage';
import Thought from '../dto/Thought';
import Task, { TaskContext } from '../dto/Task';
import { TaskFilter } from './TaskFilter';
import { Tag } from '../dto/Tag';
import IdnadrevFile from '../dto/IdnadrevFile';
import { FileId } from '../dto/FileId';
import FileFilter from './FileFilter';

export default class GlobalStore {
  colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  assignedColors: Map<string, string> = new Map();
  @observable lastSelectedRepository: RepositoryId | null = null;
  webStorage: WebStorage;

  @observable tags: Map<string, Tag> = new Map<string, Tag>();
  @observable contexts: Map<string, TaskContext> = new Map<string, TaskContext>();
  @observable repositories: Repository[] = [];

  constructor(webStorage: WebStorage) {
    this.webStorage = webStorage;
    // this.webStorage.getInitialTags().then(tags => {
    //   tags.forEach(tag => this.tags.set(tag.name, tag));
    // }).catch(e => console.error('Could not load tags %o', e));
    // this.webStorage.getAllContexts().then(contexts => {
    //   contexts.forEach(ctx => this.contexts.set(ctx, ctx));
    // }).catch(e => console.error('Could not load contexts %o', e));
    this.loadRepositories();
  }

  getTagsStartingWith(input: string): string[] {
    input = input.toLocaleLowerCase();
    return Array.from(this.tags.keys()).filter(tag => tag.startsWith(input));
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
    let repos = this.getOpenRepositories();
    let thoughts: Thought[] = [];
    for (const repo of repos) {
      let cur = await this.webStorage.loadOpenThoughts(repo);
      cur.forEach(t => thoughts.push(t));
    }
    return thoughts;
  }

  async getTasks(filter?: TaskFilter): Promise<Task[]> {
    let repos = this.getOpenRepositories();
    let tasks: Task[] = [];
    for (const repo of repos) {
      let cur = await this.webStorage.getTasks(repo, filter);
      cur.forEach(t => tasks.push(t));
    }
    return tasks;
  }

  async getAllFiles(fileFilter?: FileFilter): Promise<IdnadrevFile<{}, {}>[]> {
    let repos = this.getOpenRepositories();
    let files: IdnadrevFile<{}, {}>[] = [];
    for (const repo of repos) {
      let cur = await this.webStorage.getAllFiles(repo, fileFilter);
      cur.forEach(t => files.push(t));
    }
    return files;
  }

  async getTask(parent: FileId, repoId: RepositoryId): Promise<Task | undefined> {
    let filtered = this.getOpenRepositories().filter(r => r.id === repoId);
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
          if (item) {
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

  getOpenRepositories(): Repository[] {
    return this.repositories.filter(r => r.token !== undefined);
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
    }
  }

  async openRepositoryHashed(repo: Repository, hash: string): Promise<void> {
    await repo.openWithHash(hash);
    if (repo.token) {
      let indexes = await this.webStorage.loadIndexes(repo);
      repo.setIndexes(indexes);
    }
  }
}
