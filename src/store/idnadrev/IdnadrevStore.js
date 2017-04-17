/**
 * Created by scar on 4/15/17.
 */
import {observable, computed, action} from 'mobx';
import Loader from "./../remote/DummyLoader.js"
import {all} from "./../DummyData.js"

export default class IdnadrevStore {
  loader = new Loader()

  @observable files = new Map(all)

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