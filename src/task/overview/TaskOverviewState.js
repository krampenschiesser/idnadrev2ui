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