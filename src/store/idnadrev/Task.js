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

import {observable} from "mobx"
import IdnadrevFile from "./IdnadrevFile";


export const TaskState = {
  NONE: 'NONE',
  LATER: 'LATER',
  DELEGATED: 'DELEGATED',
  ASAP: 'ASAP',
};

export class WorkUnit {
  constructor() {
    this.start = new Date();
  }

  @observable end = null;
}

export class DelegationState {
  @observable time = null;
  @observable to = null;
}

export class Scheduling {
  @observable duration = null;

  @observable scheduledDateTime = null;
  @observable scheduledDateOnly = false;

  @observable proposedDateTime = null;
  @observable proposedDateOnly = false;

  @observable proposedYear = null;
  @observable proposedWeek = null;
  @observable proposedWeekDay = null;
}

export default class Task extends IdnadrevFile {
  constructor(name, tags = [], content = '') {
    super(name, 'TASK')
    this.tags = tags
    this.content = content
    this.details = {
      @observable state: 'NONE',
      @observable parent: null,
      @observable context: null,
      @observable estimatedTime: null,
      @observable delegation: new DelegationState(),
      @observable schedule: null,
      @observable workUnits: [],
    }
  }

  get state() {
    return this.details.state
  }

  get parent() {
    return this.details.parent
  }

  set parent(id) {
    this.details.parent = id;
  }

  get isDelegated() {
    return this.details.delegation.to !== null;
  }
}