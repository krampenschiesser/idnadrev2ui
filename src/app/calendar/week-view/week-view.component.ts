import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';
import { Day, EventInWeek, WeekSlots } from '../util';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit {
  _date: moment.Moment;
  start: moment.Moment;
  end: moment.Moment;
  _dateAsDate: Date;
  _events: CalendarEvent[];
  @Input() height: number = 900;

  @Output() newDate = new EventEmitter<moment.Moment>();
  @Output() daySelected = new EventEmitter<moment.Moment>();
  @Output() weekSelected = new EventEmitter<moment.Moment>();
  @Output() monthSelected = new EventEmitter<moment.Moment>();

  @Output() eventMoved = new EventEmitter<[CalendarEvent, moment.Moment]>();
  @Output() eventRemoved = new EventEmitter<[CalendarEvent, moment.Moment]>();

  week: Day[] = [];
  eventsInWeek: EventInWeek[] = [];
  title: string;

  ngOnInit() {
  }

  @Input() set events(e: CalendarEvent[]) {
    this._events = e;
    console.log('new events ', e);
    if (this.date && e) {
      let duration = moment.duration(this.end.diff(this.start));
      let temp = this.start.clone();

      let eventsInWeek: EventInWeek[] = [];
      for (let i = 0; i < duration.asWeeks(); i++) {
        let weekEvents = this.events;
        weekEvents.sort((a, b) => {
          let first = a.start.valueOf();
          let second = a.end.valueOf();
          return first - second;
        });
        weekEvents.forEach(e => eventsInWeek.push({
          offset: e.getWeekIndex(temp),
          length: e.getWeekLength(temp),
          event: e,
          row: 0
        }));
      }

      let weekSlots = new WeekSlots();

      let copy = eventsInWeek.slice().sort((a, b) => {
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
        weekSlots.addEvent(event);

        for (let next = findCompanion(event, copy); copy.length > 0 && next !== undefined; next = findCompanion(next, copy)) {
          let index = copy.indexOf(next);
          let tmp = copy.splice(index, 1)[0];
          weekSlots.addEvent(tmp);
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
    this._dateAsDate = d.toDate();
    let week = [];
    let eventsInWeek = [];
    this.start = d.clone().startOf('week');
    this.end = d.clone().endOf('week');
    let sameMonth = this.start.month() === this.end.month();
    this.title = this.start.format(sameMonth ? 'D' : 'D MMM - ') +
      this.end.format('D MMM, YYY') +
      ' (Week ' +
      this.end.format('w')
      + ')';

    let duration = moment.duration(this.end.diff(this.start));

    for (let i = 0; i < duration.asWeeks(); i++) {
      eventsInWeek.push([]);
    }
    for (let temp = this.start.clone(); temp.isBefore(this.end); temp = temp.add(1, 'day')) {
      let day = {
        date: temp.clone(),
      };
      week.push(day);
    }
    this.eventsInWeek = eventsInWeek;
    this.week = week;

    this.events = this.events.slice();
  }

  get date() {
    return this._date;
  }


  asMoment(date: Date) {
    return moment(date);
  }

}
