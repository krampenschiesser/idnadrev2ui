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
import {FileType} from "./FileType";
import {FileId} from "./FileId";
import {Tag} from "./Tag";


export enum TaskState {
  None,
  Later,
  Delegated,
  Asap
}

export class WorkUnit {
  @observable start: Date;
  @observable end: Date | null = null;

  constructor() {
    this.start = new Date();
  }

}

export class DelegationState {
  @observable time: Date;
  @observable to: string;
}

export class ProposedDateTime {
  @observable proposedDateTime: Date;
  @observable proposedDateOnly: boolean = true;
}

export class ProposedWeekDayYear {
  @observable proposedYear: number;
  @observable proposedWeek: number | null;
  @observable proposedWeekDay: number | null;
}

export class FixedScheduling {
  @observable scheduledDateTime: Date;
  @observable scheduledDateOnly: boolean = false;
  @observable duration: number;
}

export class Scheduling {
  @observable fixedScheduling: FixedScheduling | null;
  @observable proposedWeekDayYear: ProposedWeekDayYear | null;
  @observable proposedDate: ProposedDateTime | null;
}

export class TaskDetails {
  @observable state: TaskState = TaskState.None;
  @observable parent: FileId | null;
  @observable context: TaskContext | null;
  @observable estimatedTime: number | null;
  @observable delegation: DelegationState | null;
  @observable schedule: Scheduling | null;
  @observable workUnits: WorkUnit[] = [];
  @observable finished: Date | null;
}

export class TaskContext {
  name: string;
}

export default class Task extends IdnadrevFile<TaskDetails, String> {
  constructor(name: string, tags: Tag[] = [], content: string = '') {
    super(name, FileType.Task)
    this.tags = tags
    this.content = content
    this.details = new TaskDetails();
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
    if (this.details.delegation) {
      return this.details.delegation.to !== null;
    } else {
      return false;
    }
  }

  get isFinished() {
    return this.details.finished != null;
  }

  get context() {
    return this.details.context;
  }
}