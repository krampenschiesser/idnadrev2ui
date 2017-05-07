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
import Loader from "../remote/Loader";
import Repository, {isOpen} from "./Repository";

export default class IdnadrevStore {
  loader = new Loader()

  @observable files = new Map()
  @observable repositories = new Map()
  @observable selectedRepositoryId = null;

  constructor() {
    const localrepos = this.loader.loadLocalRepositories()
    for (let repo of localrepos) {
      this.repositories.set(repo.id, repo)
    }
    if (localrepos.length > 0) {
      this.selectedRepositoryId = localrepos[0].id;
    }
  }

  @action
  setSelectedRepositoryId(id) {
    this.selectedRepositoryId = id
  }


  @action
  loadRepositories() {
    this.loader.loadRepos().then(repos => {
      console.log(repos)
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
      const isLocal = dto.local || false;

      let repo = new Repository(cmd.name, id, isLocal)
      repo.token = token
      this.repositories.set(id, repo)
      console.log("Created repository " + cmd.name)

      console.log(this.repositories.get(id))
    })
  }

  @action
  loadLocal() {
    this.loader.loadLocalRepos(this.repositories)
    this.loader.loadLocalFiles(this.files)
  }

  @action
  loadThoughts() {
    for (let repoId of this.repositories.keys()) {
      if (!this.repositories.get(repoId).local) {
        this.loader.loadThoughts(repoId).then(thoughts => {
          for (let thought of thoughts) {
            this.files.set(thought.id, thought)
          }
        })
      }
    }
  }

  @action
  loadContent(id) {
    this.loader.loadContent(id).then((c) => {
      this.files.get(id).content = c;
    });
  }

  @action
  addFile(file) {
    const selectedRepo = this.repositories.get(this.selectedRepositoryId);

    file.repository = this.selectedRepositoryId
    file.insync = false;
    this.files.set(file.id, file)

    this.loader.saveFile(file, selectedRepo).then(fileFromRepo => {
      this.files.delete(file.id)
      Object.assign(file, fileFromRepo)
      this.files.set(file.id, file)
      file.insyync = true
    })
  }

  getRepository(id) {
    return this.repositories.get(id);
  }


  @computed get openRepositories() {
    let retval = []
    for (let repo of this.repositories.values()) {
      if (isOpen(repo)) {
        retval.push(repo)
      }
    }
    return retval
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

  @computed get repositoryNames() {
    let array = this.repositories.values().map((f) => f.name)
    array.sort();
    return array;
  }

  @computed get selectedRepository() {
    this.repositories.get(this.selectedRepositoryId)
  }
}