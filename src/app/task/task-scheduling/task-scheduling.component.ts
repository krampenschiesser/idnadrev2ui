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
    let start = now.clone();
    let end = now.clone();
    start = start.date(1).hour(0).minute(0).second(0).millisecond(0);
    end = end.date(now.daysInMonth()).weekday(6).hour(23).minute(59).second(59).millisecond(999);
    this.fetFor(start,end);
  }

  async fetFor(start: moment.Moment,end: moment.Moment) {
    this.tasks = await this.taskService.getScheduledTasks(start, end);
    console.log('Got tasks ', this.tasks);
    this.events = this.tasks.filter(t => t.details.schedule.isScheduled()).map(t => {
      let schedule = t.details.schedule;
      let event: CalendarEvent = {
        id: t.id,
        allDay: schedule.isAllDay(),
        start: schedule.getStartDate(),
        end: schedule.getEndDate(t.details.estimatedTime),
        title: t.name,
      };
      return event;
    });
    console.log('Got events ', this.events);
  }
}