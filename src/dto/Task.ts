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

import { observable } from 'mobx';
import IdnadrevFile from './IdnadrevFile';
import { FileType } from './FileType';
import { FileId } from './FileId';
import { Tag } from './Tag';
import moment = require('moment');

export enum TaskState {
  None = 'None',
  Later = 'Later',
  Delegated = 'Delegated',
  Asap = 'Asap'
}

export class WorkUnit {
  @observable start: Date;
  @observable end?: Date;

  constructor() {
    this.start = new Date();
  }

  setEnd(end: Date): WorkUnit {
    this.end = end;
    return this;
  }

  setStart(start: Date): WorkUnit {
    this.start = start;
    return this;
  }

  getDurationInMinutes() {
    let now = this.end ? this.end : new Date();
    return moment(now).diff(moment(this.start), 'minutes');
  }
}

export class Delegation {
  @observable delegationStarted: Date;
  @observable to: string;
}

export class DelegationHistory extends Delegation {
  @observable delegationStarted: Date;
  @observable delegationEnded: Date;
  @observable to: string;

  constructor(original: Delegation) {
    super();
    this.delegationStarted = original.delegationStarted;
    this.to = original.to;
    this.delegationEnded = new Date();
  }
}

export class DelegationState {
  history: DelegationHistory[] = [];
  current?: Delegation;
}

export class ProposedDateTime {
  @observable proposedDateTime: Date;
  @observable proposedDateOnly: boolean = true;
}

export class ProposedWeekDayYear {
  @observable proposedYear: number = moment().year();
  @observable proposedWeek: number = moment().isoWeek();
  @observable proposedWeekDay?: number;
}

export class FixedScheduling {
  @observable scheduledDateTime: Date;
  @observable scheduledDateOnly: boolean = false;
}

export class Scheduling {
  @observable fixedScheduling?: FixedScheduling;
  @observable proposedWeekDayYear?: ProposedWeekDayYear;
  @observable proposedDate?: ProposedDateTime;
}

export class TaskDetails {
  @observable state: TaskState = TaskState.None;
  @observable parent?: FileId;
  @observable context?: TaskContext;
  @observable estimatedTime?: Seconds;
  @observable delegation: DelegationState = new DelegationState();
  @observable schedule?: Scheduling;
  @observable workUnits: WorkUnit[] = [];
  @observable finished?: Date;
  @observable action: boolean;
}

export type TaskContext = string;
export type Seconds = number;

export default class Task extends IdnadrevFile<TaskDetails, string> {
  children?: Task[];

  constructor(name: string, tags: Tag[] = [], content: string = '') {
    super(name, FileType.Task);
    this.tags = tags;
    this.content = content;
    this.details = new TaskDetails();
  }

  get state() {
    return this.details.state;
  }

  get parent(): FileId | undefined {
    return this.details.parent;
  }

  set parent(id: FileId | undefined) {
    this.details.parent = id;
  }

  get isDelegated() {
    return this.details.delegation.current;
  }

  get isFinished() {
    return this.details.finished != null;
  }

  get context() {
    return this.details.context;
  }

  withContent(content: string): Task {
    this.content = content;
    return this;
  }

  isActionable(): boolean {
    return this.details.estimatedTime !== null || this.details.action;
  }

  getScheduledDate(): Date | undefined {
    if (this.details.schedule !== undefined && this.details.schedule.fixedScheduling !== undefined) {
      return this.details.schedule.fixedScheduling.scheduledDateTime;
    } else {
      return undefined;
    }
  }

  getProposedDate(): Date | undefined {
    if (this.details.schedule !== undefined && this.details.schedule.proposedDate !== undefined) {
      return this.details.schedule.proposedDate.proposedDateTime;
    } else {
      return undefined;
    }
  }

}