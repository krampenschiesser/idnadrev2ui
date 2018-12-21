import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import * as moment from 'moment';
import Task from '../../dto/Task';
import CalendarEvent from '../../calendar/CalendarEvent';

enum Mode {
  MONTH = 'Month',
  WEEK = 'Week',
  DAY = 'Day',
  AGENDA = 'Agenda',
}

@Component({
  selector: 'app-task-scheduling',
  templateUrl: './task-scheduling.component.html',
  styleUrls: ['./task-scheduling.component.css']
})
export class TaskSchedulingComponent implements OnInit {
  calEvents: CalendarEvent[] = [];
  tasks: Task[] = [];
  now = moment();
  mode = Mode.WEEK;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    let now = moment();
    this.fetchForDate(now);
  }

  private fetchForDate(now: moment.Moment) {
    this.now = now;
    let start = now.clone();
    let end = now.clone();
    if (this.mode === Mode.MONTH) {
      start = start.date(1).hour(0).minute(0).second(0).millisecond(0);
      end = end.date(now.daysInMonth()).weekday(6).hour(23).minute(59).second(59).millisecond(999);
    } else if (this.mode === Mode.WEEK) {
      start = start.weekday(0).hour(0).minute(0).second(0).millisecond(0);
      end = end.weekday(6).hour(23).minute(59).second(59).millisecond(999);
    } else  {
      start = start.hour(0).minute(0).second(0).millisecond(0);
      end = end.hour(23).minute(59).second(59).millisecond(999);
    }
    this.fetchForRange(start, end);
  }

  async fetchForRange(start: moment.Moment, end: moment.Moment) {
    this.tasks = [];
    this.tasks = await this.taskService.getScheduledTasks(start, end);
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
  }
}