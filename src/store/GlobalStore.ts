import Repository from '../dto/Repository';
import {observable} from 'mobx';
import {RepositoryId} from '../dto/RepositoryId';
import WebStorage from './WebStorage';
import Thought from '../dto/Thought';
import Task, {TaskContext} from '../dto/Task';
import {TaskFilter} from './TaskFilter';
import {Tag} from "../dto/Tag";

export interface IGlobalStore {
    getTagsStartingWith(input: string): string[];
}

export class GlobalStore implements IGlobalStore {
    colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    assignedColors: Map<string, string> = new Map();
    @observable lastSelectedRepository: RepositoryId | null = null;
    webStorage: WebStorage;

    @observable tags: Map<string, Tag>;
    @observable contexts: Map<string, TaskContext>;


    constructor(webStorage: WebStorage) {
        this.webStorage = webStorage;
        this.webStorage.getInitialTags()
    }

    getTagsStartingWith(input: string): string[] {
        input = input.toLocaleLowerCase();
        return Array.from(this.tags.keys()).filter(tag => tag.startsWith(input))
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
            let color = this.colors[index];
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

    getTasks(filter?: TaskFilter): Promise<Task[]> {
        return this.webStorage.getTasks(filter);
    }
}
