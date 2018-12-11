import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';
import { ActivatedRoute } from '@angular/router';

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
  _events: CalendarEvent[];
  @Input() height: number = 900;

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
        console.log('sorted order: ', copy.map(e => e.event.title + '[' + e.offset + '->' + e.length + ']'));

        let findCompanion = (master: EventInWeek, all: EventInWeek[]): EventInWeek | undefined => {
          let candidates = all.filter(e => e.offset > (master.offset + master.length - 1));
          candidates.sort((a, b) => {
            return b.length - a.length;
          });
          if (candidates.length > 0) {
            console.log('found candidate ', candidates[0].event.title, ' for ', master.event.title);
            return candidates[0];
          } else {
            return undefined;
          }
        };
        while (copy.length > 0) {
          let event = copy.splice(0, 1)[0];
          console.log('got event', event.event.title);
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
    this._date = d;
    let start = d.clone().startOf('month').startOf('weeks');
    let end = d.clone().endOf('month').endOf('weeks');

    let duration = moment.duration(end.diff(start));

    let temp = start.clone();
    for (let i = 0; i < duration.asWeeks(); i++) {
      this.weeks.push([]);
      this.eventsInWeek.push([]);
    }
    for (let i = 0; i < 7; i++) {
      this.dayOfWeek[i] = [];
    }
    temp = start.clone();
    for (let temp = start.clone(); temp.isBefore(end); temp = temp.add(1, 'day')) {
      let day = {
        date: temp.clone(),
      };
      this.days.push(day);
      this.dayOfWeek[temp.weekday()].push(day);
      let weekIndex = Math.floor(moment.duration(temp.diff(start)).asWeeks());
      this.weeks[weekIndex].push(day);

    }
  }

  get date() {
    return this._date;
  }


}

class DaySlots {
  rows: (EventInWeek | undefined)[] = [];

  addEvent(event: EventInWeek, row: number) {
    this.rows[row] = event;
    event.row = row;
  }

  getFreeRow(minRow: number): number {
    console.log('rows', this.rows.slice());
    minRow = Math.max(0, minRow);
    for (let i = this.rows.length; i <= minRow; i++) {
      console.log('psuhing row', 'i', i, 'minRow', minRow);
      this.rows.push(undefined);
    }
    if (this.rows[minRow] === undefined) {
      console.log('given row is undefined ', minRow);
      return minRow;
    } else {
      this.rows.push(undefined);
      console.log(minRow, 'add new row ', this.rows.length - 1);
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
      console.log('day ', i, ' row ', cur, ' max ', row);
    }
    for (let i = event.offset; i < event.offset + event.length; i++) {
      console.log('Adding event ', event.event.title, ' to day ', i, ' row ', row);
      this.days[i].addEvent(event, row);
    }
  }
}