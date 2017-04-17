/**
 * Created by scar on 4/10/17.
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