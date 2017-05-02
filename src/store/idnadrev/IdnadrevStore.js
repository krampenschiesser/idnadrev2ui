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

import {observable, computed, action} from 'mobx';
import Loader from "./../remote/DummyLoader.js"
import {all} from "./../DummyData.js"

export default class IdnadrevStore {
  loader = new Loader()

  @observable files = new Map(all)
  @observable repositories = new Map()

  @action
  getRepositories() {
    this.loader.loadRepositories(this.repositories)
  }

  @action
  loadContent(id) {
    this.loader.loadContent(id).then((c)=>{
      this.files.get(id).content=c;
    });
  }

  @action
  addFile(file) {
    this.files.set(file.id, file)
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