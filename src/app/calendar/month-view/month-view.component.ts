import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';

interface Day {
  date: moment.Moment,
  events: CalendarEvent[]
}

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  @Input() date: moment.Moment;
  @Input() events: CalendarEvent[];

  @Output() daySelected = new EventEmitter<moment.Moment>();
  @Output() weekSelected = new EventEmitter<[moment.Moment, moment.Moment]>();
  @Output() monthSelected = new EventEmitter<moment.Moment>();

  @Output() eventMoved = new EventEmitter<[CalendarEvent, moment.Moment]>();
  @Output() eventRemoved = new EventEmitter<[CalendarEvent, moment.Moment]>();

  days: Day[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  forDayOfWeek(day: number): Day[] {
    return this.days.filter(d=>d.date.weekday() == day);
  }
}
