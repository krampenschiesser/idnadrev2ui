import Repository from '../dto/Repository';
import {observable} from 'mobx';
import {RepositoryId} from '../dto/RepositoryId';
import WebStorage from './WebStorage';
import Thought from '../dto/Thought';
import Task from '../dto/Task';
import {TaskFilter} from './TaskFilter';

export interface IGlobalStore {
    getTagsStartingWith(input: string): string[];
}

export class GlobalStore implements IGlobalStore {
    colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    assignedColors: Map<string, string> = new Map();
    @observable lastSelectedRepository: RepositoryId | null = null;
    webStorage: WebStorage;


    constructor(webStorage: WebStorage) {
        this.webStorage = webStorage;
    }

    getTagsStartingWith(input: string): string[] {
        return ['beer', 'steak', 'pipe'].filter(val => val.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()));
    }

    getTagColor(tag: string): string {
        // if (tag === 'beer') {
        //     return 'red';
        // } else if (tag === 'steak') {
        //     return 'green';
        // } else if (tag === 'pipe') {
        //     return 'blue';
        // } else {
        let newVar = this.assignedColors.get(tag);
        if (newVar === undefined) {
            let index = Math.floor(Math.random() * this.colors.length);
            console.log(index);
            let color = this.colors[index];
            console.log(color);
            this.assignedColors.set(tag, color);
            return color;
        } else {
            return newVar;
        }
        // }
    }

    getOpenRepositories(): Repository[] {
        return [
            new Repository('Local', 'test', true),
            new Repository('Other', 'test2', true),
        ];
    }

    getOpenThoughts(): Promise<Thought[]> {
        return this.webStorage.loadOpenThoughts();
    }

    getTasks(filter?: TaskFilter) : Promise<Task[]>{
        return this.webStorage.getTasks(filter);
    }
}
