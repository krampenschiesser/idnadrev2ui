import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';
import { Day, EventInWeek, WeekSlots } from '../util';

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

  weeks: Day[][] = [];
  eventsInWeek: EventInWeek[][] = [];

  ngOnInit() {
  }

  @Input() set events(e: CalendarEvent[]) {
    this._events = e;
    console.log('new events ',e)
    if (this.date && e) {
      let start = this.date.clone().startOf('month').startOf('week');
      let end = this.date.clone().endOf('month').endOf('week');
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
    let weeks = [];
    let eventsInWeek = [];
    let start = d.clone().startOf('month').startOf('week');
    let end = d.clone().endOf('month').endOf('week');

    let weeksInYear = start.weeksInYear();
    let startWeek = start.week();

    let duration = moment.duration(end.diff(start));

    for (let i = 0; i < duration.asWeeks(); i++) {
      weeks.push([]);
      eventsInWeek.push([]);
    }
    for (let temp = start.clone(); temp.isBefore(end); temp = temp.add(1, 'day')) {
      let day = {
        date: temp.clone(),
      };
      let curWeek = temp.week();
      let weekIndex = -1;
      if (curWeek<startWeek) {
        weekIndex= curWeek + weeksInYear - startWeek;
      } else {
        weekIndex = curWeek - startWeek;
      }
      weeks[weekIndex].push(day);
    }
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

