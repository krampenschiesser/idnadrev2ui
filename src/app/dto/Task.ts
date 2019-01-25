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

import * as moment from 'moment';
import { FileId } from './FileId';
import { FileType } from './FileType';
import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';

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

  getDurationInMinutes(): number {
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
  proposedDateOnly: boolean = false;
  proposedWeekOnly: boolean = false;
}

export class FixedScheduling {
  scheduledDateTime: Date;
  scheduledDateOnly: boolean = false;
}

export class Scheduling {
  fixedScheduling?: FixedScheduling;
  proposedDate?: ProposedDateTime;

  isScheduled(): boolean {
    return !!this.fixedScheduling || !!this.proposedDate;
  }

  isAllDay() {
    if (this.fixedScheduling) {
      return this.fixedScheduling.scheduledDateOnly;
    } else if (this.proposedDate) {
      return this.proposedDate.proposedDateOnly || this.proposedDate.proposedWeekOnly;
    }
  }

  getStartDate(): Date | undefined {
    if (this.fixedScheduling) {
      let date = moment(this.fixedScheduling.scheduledDateTime);
      if (this.fixedScheduling.scheduledDateOnly) {
        date = date.hour(0).minute(0).second(0).millisecond(0);
      }
      return date.toDate();
    } else if (this.proposedDate) {

      let date = moment(this.proposedDate.proposedDateTime);
      if (this.proposedDate.proposedDateOnly) {
        date = date.hour(0).minute(0).second(0).millisecond(0);
      } else if (this.proposedDate.proposedWeekOnly) {
        date = date.weekday(0).hour(0).minute(0).second(0).millisecond(0);
      }
      return date.toDate();
    } else {
      return undefined;
    }
  }

  getEndDate(estimatedTime: Seconds | undefined): Date | undefined {
    let startDate = this.getStartDate();
    let end = moment(startDate);
    if (startDate) {
      if (estimatedTime) {
        end = end.add(estimatedTime,'seconds');
        return end.toDate();
      } else {
        if (this.fixedScheduling) {
          end = end.hour(23).minute(59).second(59).millisecond(999);
          return end.toDate();
        } else if (this.proposedDate) {
          if (this.proposedDate.proposedWeekOnly) {
            end = end.weekday(6).hour(23).minute(59).second(59).millisecond(999);
            return end.toDate();
          } else {
            end = end.hour(23).minute(59).second(59).millisecond(999);
            return end.toDate();
          }
        }
      }
    }
  }
}

export class TaskDetails {
  state?: string;
  parent?: FileId;
  estimatedTime?: Seconds;
  delegation: DelegationState = new DelegationState();
  schedule?: Scheduling;
  earliestStartDate?: Date;
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
    return !!this.details.estimatedTime || this.details.action === true;
  }

  isProject(): boolean {
    return this.children && this.children.length > 0;
  }

  getRemainingTime(): number | undefined {
    if (this.details.estimatedTime) {
      let totalWorked = 0;
      this.details.workUnits.map(u => u.getDurationInMinutes()).forEach(v => totalWorked += v);
      return this.details.estimatedTime = totalWorked;
    }
    return undefined;
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

  isInProgress() {
    return this.details.workUnits.findIndex(u => u.end === undefined) >= 0;
  }

  stopWork() {
    let length = this.details.workUnits.length;
    if (length > 0) {
      let last = this.details.workUnits[length - 1];
      if (!last.end) {
        last.end = new Date();
        console.log('stopped work');
      }
    }
  }

  startWork() {
    this.details.workUnits.push(new WorkUnit());
  }
}