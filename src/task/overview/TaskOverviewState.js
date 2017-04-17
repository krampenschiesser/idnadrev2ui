/**
 * Created by scar on 4/15/17.
 */

import {observable, action} from "mobx"

export default class TaskOverviewState {
  @observable expanded = []
  @observable selected
  @observable showHoverPreview = true;
  @observable showTreeView = true;

  @action
  expand(task) {
    if (this.expanded.indexOf(task.id) === -1) {
      this.expanded.push(task.id)
    }
  }

  @action
  collapse(task) {
    const index = this.expanded.indexOf(task.id);
    if (index > -1) {
      this.expanded.splice(index, 1)
    }
  }

  isExpanded(id) {
    return this.expanded.indexOf(id) >= 0
  }


  @action
  select(task) {
    this.selected = task;
  }

  @action
  toggleHoverPreview() {
    this.showHoverPreview = !this.showHoverPreview;
  }

  @action
  toggleTreeList() {
    this.showTreeView = !this.showTreeView;
  }
}