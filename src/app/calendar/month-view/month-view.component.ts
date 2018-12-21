import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';

interface Day {
  date: moment.Moment,
}

interface EventInWeek {
  offset: number;
  length: number;
  event: CalendarEvent;
  row: number;
}

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  _date: moment.Moment;
  _dateAsDate: Date;
  _events: CalendarEvent[];
  @Input() height: number = 900;

  @Output() newDate = new EventEmitter<moment.Moment>();
  @Output() daySelected = new EventEmitter<moment.Moment>();
  @Output() weekSelected = new EventEmitter<moment.Moment>();
  @Output() monthSelected = new EventEmitter<moment.Moment>();

  @Output() eventMoved = new EventEmitter<[CalendarEvent, moment.Moment]>();
  @Output() eventRemoved = new EventEmitter<[CalendarEvent, moment.Moment]>();

  days: Day[] = [];
  dayOfWeek: Day[][] = [];
  weeks: Day[][] = [];
  eventsInWeek: EventInWeek[][] = [];

  ngOnInit() {
  }

  @Input() set events(e: CalendarEvent[]) {
    this._events = e;
    console.log('new events ',e)
    if (this.date && e) {
      let start = this.date.clone().startOf('month').startOf('weeks');
      let end = this.date.clone().endOf('month').endOf('weeks');
      let duration = moment.duration(end.diff(start));
      let temp = start.clone();

      let eventsInWeek: EventInWeek[][] = [];
      for (let i = 0; i < duration.asWeeks(); i++) {
        eventsInWeek.push([]);
        let weekEvents = this.events.filter(e => e.isInWeek(temp));
        weekEvents.sort((a, b) => {
          let first = a.start.valueOf();
          let second = a.end.valueOf();
          return first - second;
        });
        weekEvents.forEach(e => eventsInWeek[i].push({
          offset: e.getWeekIndex(temp),
          length: e.getWeekLength(temp),
          event: e,
          row: 0
        }));
        temp.add(1, 'week');
      }

      let weekSlots: WeekSlots[] = [];

      for (let i = 0; i < duration.asWeeks(); i++) {
        weekSlots.push(new WeekSlots());
        let copy = eventsInWeek[i].slice().sort((a, b) => {
          if (a.offset < b.offset) {
            return -1;
          } else if (a.offset > b.offset) {
            return 1;
          } else if (a.length > b.length) {
            return -1;
          } else if (a.length < b.length) {
            return 1;
          } else {
            return 0;
          }
        });

        let findCompanion = (master: EventInWeek, all: EventInWeek[]): EventInWeek | undefined => {
          let candidates = all.filter(e => e.offset > (master.offset + master.length - 1));
          candidates.sort((a, b) => {
            return b.length - a.length;
          });
          if (candidates.length > 0) {
            return candidates[0];
          } else {
            return undefined;
          }
        };
        while (copy.length > 0) {
          let event = copy.splice(0, 1)[0];
          weekSlots[i].addEvent(event);

          for (let next = findCompanion(event, copy); copy.length > 0 && next !== undefined; next = findCompanion(next, copy)) {
            let index = copy.indexOf(next);
            let tmp = copy.splice(index, 1)[0];
            weekSlots[i].addEvent(tmp);
          }
        }
      }
      this.eventsInWeek = eventsInWeek;
    }
  }

  get events() {
    return this._events;
  }

  @Input() set date(d: moment.Moment) {
    console.log('new date', d.toDate());
    this._date = d;
    this._dateAsDate = d.toDate();
    let days = [];
    let weeks = [];
    let eventsInWeek = [];
    let dayOfWeek = [];
    let start = d.clone().startOf('month').startOf('weeks');
    let end = d.clone().endOf('month').endOf('weeks');

    let weeksInYear = start.weeksInYear();
    let startWeek = start.week();

    let duration = moment.duration(end.diff(start));

    for (let i = 0; i < duration.asWeeks(); i++) {
      weeks.push([]);
      eventsInWeek.push([]);
    }
    for (let i = 0; i < 7; i++) {
      dayOfWeek[i] = [];
    }
    for (let temp = start.clone(); temp.isBefore(end); temp = temp.add(1, 'day')) {
      let day = {
        date: temp.clone(),
      };
      days.push(day);
      dayOfWeek[temp.weekday()].push(day);
      let curWeek = temp.week();
      let weekIndex = -1;
      if (curWeek<startWeek) {
        weekIndex= curWeek + weeksInYear - startWeek;
      } else {
        weekIndex = curWeek - startWeek;
      }
      weeks[weekIndex].push(day);
    }
    this.days = days;
    this.dayOfWeek = dayOfWeek;
    this.eventsInWeek = eventsInWeek;
    if (weeks[weeks.length - 1].length === 0) {
      weeks.splice(weeks.length - 1, 1);
    }
    this.weeks = weeks;

    this.events=this.events.slice();
  }

  get date() {
    return this._date;
  }


  asMoment(date: Date) {
    return moment(date);
  }
}

class DaySlots {
  rows: (EventInWeek | undefined)[] = [];

  addEvent(event: EventInWeek, row: number) {
    this.rows[row] = event;
    event.row = row;
  }

  getFreeRow(minRow: number): number {
    minRow = Math.max(0, minRow);
    for (let i = this.rows.length; i <= minRow; i++) {
      this.rows.push(undefined);
    }
    if (this.rows[minRow] === undefined) {
      return minRow;
    } else {
      this.rows.push(undefined);
      return this.rows.length - 1;
    }
  }
}

class WeekSlots {
  days: DaySlots[] = [];


  constructor() {
    for (let i = 0; i < 7; i++) {
      this.days.push(new DaySlots());
    }
  }

  addEvent(event: EventInWeek) {
    let row = -1;
    for (let i = event.offset; i < event.offset + event.length; i++) {
      let cur = this.days[i].getFreeRow(row);
      row = Math.max(row, cur);
    }
    for (let i = event.offset; i < event.offset + event.length; i++) {
      this.days[i].addEvent(event, row);
    }
  }
}