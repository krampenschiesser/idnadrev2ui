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

import {observable, action} from 'mobx';

import NavigationState from "./NavigationState.js"
import ThoughtOverviewState from "./ThoughtOverviewState.js"
import ProcessThoughtState from "./ProcessThoughtState.js"
import TaskOverviewState from "./../../task/overview/TaskOverviewState";

export default class UIStore {
  navigationState = new NavigationState();
  thoughtOverviewState = new ThoughtOverviewState();
  processThoughtState = new ProcessThoughtState();
  taskOverviewState = new TaskOverviewState();

  @observable mobile;
  firstTimeMobile = true;

  @observable showTooltips = true;

  @action
  toggleTooltips() {
    this.showTooltips = !this.showTooltips;
  }

  @action
  setMobile(mobile) {
    this.mobile = mobile;

    if (mobile && this.firstTimeMobile) {
      this.navigationState.setVisible(false);
      this.firstTimeMobile = false;
    }
  }

}
