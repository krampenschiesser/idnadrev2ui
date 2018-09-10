import { observable } from 'mobx';
import { RepositoryId } from './RepositoryId';
import { RepositoryToken } from './RepositoryToken';

export default class Repository {
  id: RepositoryId;
  @observable name: string;
  @observable token?: RepositoryToken ;

  constructor(name: string, id: RepositoryId) {
    this.name = name;
    this.id = id;
  }

  isLocked(): boolean {
    return this.token === undefined;
  }
  isOpen(): boolean {
    return this.token !== undefined;
  }
}