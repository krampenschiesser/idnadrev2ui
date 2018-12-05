import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import * as moment from 'moment';
import Task from '../../dto/Task';

interface OpenDateSpanInput {
  start?: Date;
  end?: Date;
  allDay?: boolean;
  [otherProp: string]: any;
}
type EventRenderingChoice = '' | 'background' | 'inverse-background' | 'none';
type ConstraintInput = 'businessHours' | string | OpenDateSpanInput | {
  [timeOrRecurringProp: string]: any;
};
interface CalendarEvent {
  id?: string | number;
  groupId?: string | number;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  title?: string;
  url?: string;
  classNames?: string[];
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  resourceEditable?: boolean;
  rendering?: EventRenderingChoice;
  overlap?: boolean;
  constraint?: ConstraintInput;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

@Component({
  selector: 'app-task-scheduling',
  templateUrl: './task-scheduling.component.html',
  styleUrls: ['./task-scheduling.component.css']
})
export class TaskSchedulingComponent implements OnInit {
  options = {};
  events: CalendarEvent[] = [];
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    let now = moment();
  }

  async fetchForWeekAround(now: moment.Moment) {
    this.tasks = await this.taskService.getScheduledTasks(now);

  }
}