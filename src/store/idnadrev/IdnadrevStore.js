/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
 */

import {observable, extendObservable, computed, action} from 'mobx';
import {all} from "./../DummyData.js"
import Loader from "../remote/Loader";
import Repository from "./Repository";

export default class IdnadrevStore {
    loader = new Loader()

    @observable files = new Map(all)
    @observable repositories = new Map()

    constructor() {
        const localrepos = this.loader.loadLocalRepositories()
        for (let repo of localrepos) {
            this.repositories.set(repo.id, repo)
        }
    }

    @action
    loadRepositories() {
        this.loader.loadRepos().then(repos => {
            for (let repo of repos) {
                if (!this.repositories.has(repo.id)) {

                    this.repositories.set(repo.id, Object.assign(new Repository(), repo))
                }
            }
        })
    }

    @action
    openRepository(id, username, password) {
        this.loader.openRepository(id, username, password).then(token => {
            console.log("Logged into " + id)
            this.repositories.get(id).token = token.id
            console.log(this.repositories.get(id))
        })
    }

    @action
    createRepository(cmd) {
        this.loader.createRepository(cmd).then(dto => {
            console.log(dto)
            const id = dto.id
            const token = dto.token;

            let repo = new Repository(cmd.name,id,false)
            repo.token=token
            this.repositories.set(id,repo)
            console.log("Created repository " + cmd.name)

            console.log(this.repositories.get(id))
        })
    }

    @action
    loadContent(id) {
        this.loader.loadContent(id).then((c) => {
            this.files.get(id).content = c;
        });
    }

    @action
    addFile(file) {
        this.files.set(file.id, file)
    }

    getRepository(id) {
        return this.repositories.get(id);
    }


    @computed get thoughts() {
        return this.files.values()
            .filter((file) => file.fileType === 'THOUGHT');
    }

    @computed get tasks() {
        return this.files.values()
            .filter((file) => file.fileType === 'TASK');
    }

    @computed get documents() {
        return this.files.values()
            .filter((file) => file.fileType === 'DOCUMENT');
    }

    @computed get getTaskTree() {
        const allTasks = this.tasks;

        let roots = [];

        for (let task of allTasks) {
            if (task.parent) {
                const parent = this.files.get(task.parent)
                if (parent.children) {
                    parent.children.push(task.id)
                } else {
                    parent.children = [task.id];
                }
            } else {
                roots.push(task)
            }
        }
        return roots;
    }

    @computed get tags() {
        let tags = new Set();
        for (let array of this.files.values().map((f) => f.tags)) {
            for (let element of array) {
                tags.add(element);
            }
        }
        const array = Array.from(tags);
        array.sort();
        return array;
    }
}