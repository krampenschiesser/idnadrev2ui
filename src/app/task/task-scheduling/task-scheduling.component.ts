import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import * as moment from 'moment';
import Task from '../../dto/Task';
import CalendarEvent from '../../calendar/CalendarEvent';

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

interface NgCalendarEvent {
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
  options = {
    header: {
      left: 'title',
      center: 'month,agendaWeek,agendaDay,basicDay',
      right: 'today prev,next'
    }, buttonText: {
      basicDay: 'Day View'
    },
    nowIndicator: true,
    navLinks: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '9:00',
      endTime: '18:00',
    },
    views: {
      month: {
        fixedWeekCount: true,

      }
    },
    navLinkDayClick: function (date, jsEvent) {
      console.log('in options click', date, jsEvent);
      this._navLinkDayClick(date, jsEvent);
    }
  };
  events: NgCalendarEvent[] = [];
  calEvents: CalendarEvent[] = [];
  tasks: Task[] = [];
  now = moment();

  constructor(private taskService: TaskService) {
  }

  _navLinkDayClick(date: any, jsEvent: any) {
    console.log('in class click');
  }

  ngOnInit() {
    let now = moment();
    let start = now.clone();
    let end = now.clone();
    start = start.date(1).hour(0).minute(0).second(0).millisecond(0);
    end = end.date(now.daysInMonth()).weekday(6).hour(23).minute(59).second(59).millisecond(999);
    this.fetchFor(start, end);
  }

  async fetchFor(start: moment.Moment, end: moment.Moment) {
    this.tasks = await this.taskService.getScheduledTasks(start, end);
    console.log('Got tasks ', this.tasks);
    this.events = this.tasks.filter(t => t.details.schedule.isScheduled()).map(t => {
      let schedule = t.details.schedule;
      let event: NgCalendarEvent = {
        id: t.id,
        allDay: schedule.isAllDay(),
        start: schedule.getStartDate(),
        end: schedule.getEndDate(t.details.estimatedTime),
        title: t.name,
        editable: true
      };
      return event;
    });
    this.calEvents = this.tasks.filter(t => t.details.schedule.isScheduled()).map(t => {
      let schedule = t.details.schedule;
      let event: CalendarEvent = Object.assign(new CalendarEvent(), {
        id: t.id,
        allDay: schedule.isAllDay(),
        start: moment(schedule.getStartDate()),
        end: moment(schedule.getEndDate(t.details.estimatedTime)),
        title: t.name,
      });
      return event;
    });
    console.log('Got events ', this.events);
  }

}