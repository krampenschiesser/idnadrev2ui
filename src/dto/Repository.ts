import { observable } from 'mobx';
import { RepositoryId } from './RepositoryId';
import { RepositoryToken } from './RepositoryToken';

export default class Repository {
  id: RepositoryId;
  @observable name: string;
  @observable token: RepositoryToken | null;

  constructor(name: string, id: RepositoryId) {
    this.name = name;
    this.id = id;
  }

  isOpen(): boolean {
    return this.token === null;
  }
}