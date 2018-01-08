import {observable} from 'mobx';
import {RepositoryId} from './RepositoryId';
import {RepositoryToken} from './RepositoryToken';

export default class Repository {
    id: RepositoryId;
    @observable name: string;
    @observable token: RepositoryToken | null;
    @observable local: boolean;

    constructor(name: string, id: RepositoryId, local = false) {
        this.name = name;
        this.id = id;
        this.local = local;
    }

    isOpen(): boolean {
        return this.local || this.token === null;
    }
}