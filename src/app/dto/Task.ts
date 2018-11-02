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

import IdnadrevFile from './IdnadrevFile';
import { FileType } from './FileType';
import { FileId } from './FileId';
import { Tag } from './Tag';
import * as moment from 'moment';

export class WorkUnit {
  start: Date;
  end?: Date;

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
  delegationStarted: Date;
  to: FileId;//fileId of Contact


  constructor(to: FileId, delegationStarted?: Date) {
    this.delegationStarted = delegationStarted ? delegationStarted : new Date();
    this.to = to;
  }
}

export class DelegationHistory extends Delegation {
  delegationEnded: Date;

  constructor(original: Delegation, delegationEnded?: Date) {
    super(original.to, original.delegationStarted);
    this.delegationEnded = delegationEnded ? delegationEnded : new Date();
  }
}

export class DelegationState {
  history: DelegationHistory[] = [];
  current?: Delegation;
}

export class ProposedDateTime {
  proposedDateTime: Date;
  proposedDateOnly: boolean = true;
  proposedWeekOnly: boolean = true;
}

export class FixedScheduling {
  scheduledDateTime: Date;
  scheduledDateOnly: boolean = false;
}

export class Scheduling {
  fixedScheduling?: FixedScheduling;
  proposedDate?: ProposedDateTime;
}

export class TaskDetails {
  state?: string;
  parent?: FileId;
  estimatedTime?: Seconds;
  delegation: DelegationState = new DelegationState();
  schedule?: Scheduling;
  earliestStartDate?: Date
  workUnits: WorkUnit[] = [];
  finished?: Date;
  action: boolean;
}

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

  get isDelegated(): boolean {
    return this.details.delegation.current != undefined;
  }

  get isFinished() {
    return this.details.finished != null;
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

  isInDateRange(firstOfWeek: moment.Moment, lastOfWeek: moment.Moment): boolean {
    let schedule = this.details.schedule;
    if (schedule) {
      let fixedScheduling = schedule.fixedScheduling;
      let proposedDate = schedule.proposedDate;
      if (fixedScheduling) {
        let start = moment(fixedScheduling.scheduledDateTime);
        return start.isBetween(firstOfWeek, lastOfWeek, undefined, '[]') && !!this.details.estimatedTime;
      } else if (proposedDate) {
        let start = moment(proposedDate.proposedDateTime);
        return start.isBetween(firstOfWeek, lastOfWeek, undefined, '[]');
      }
    }
    return false;
  }

  getStartEnd(): [moment.Moment, moment.Moment] {
    let schedule = this.details.schedule;
    if (schedule) {
      let fixedScheduling = schedule.fixedScheduling;
      let proposedDate = schedule.proposedDate;
      let estimatedTime = this.details.estimatedTime;
      if (fixedScheduling) {
        let start = moment(fixedScheduling.scheduledDateTime);
        let end = start.clone().add(estimatedTime, 'seconds');
        return [start, end];
      } else if (proposedDate) {
        let start = moment(proposedDate.proposedDateTime);
        let end = start.add(estimatedTime ? estimatedTime : 15 * 60, 'seconds');
        return [start, end];
      }
    }
    return [moment(), moment()];
  }

  isWholeDay(): boolean {
    let schedule = this.details.schedule;
    if (schedule) {
      let proposedDate = schedule.proposedDate;
      if (proposedDate) {
        return proposedDate.proposedDateOnly;
      }
    }
    return false;
  }

  isWholeWeek(): boolean {
    let schedule = this.details.schedule;
    if (schedule) {
      let proposed = schedule.proposedDate;
      if (proposed.proposedWeekOnly) {
        return true;
      }
    }
    return false;
  }

  addChild(t: Task) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(t);
  }
}