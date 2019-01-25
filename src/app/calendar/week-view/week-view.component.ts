import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import CalendarEvent from '../CalendarEvent';
import { Day, DaySlots, EventInDay, EventInWeek, WeekSlots } from '../util';
import { of } from 'rxjs';

interface Interval {
  hour: number,
  sub: number,
}

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
  _height: number;
  _columnHeight: number;
  extendedHours: boolean = false;

  @Output() newDate = new EventEmitter<moment.Moment>();
  @Output() daySelected = new EventEmitter<moment.Moment>();
  @Output() weekSelected = new EventEmitter<moment.Moment>();
  @Output() monthSelected = new EventEmitter<moment.Moment>();

  @Output() eventMoved = new EventEmitter<[CalendarEvent, moment.Moment]>();
  @Output() eventRemoved = new EventEmitter<[CalendarEvent, moment.Moment]>();

  week: Day[] = [];
  eventsInWeek: EventInDay[] = [];
  dayLongEventsInWeek: EventInWeek[] = [];
  title: string;
  intervals: Interval[] = [];
  dayLongEventHeight: number;
  startHour = 0;
  endHour = 0;
  days = 7;
  hourSubdivision = 2;

  ngOnInit() {
    this.generateIntervals();
    this.height = 800;
  }

  private generateIntervals() {
    this.intervals = [];
    this.endHour = this.extendedHours ? 24 : 22;
    this.startHour = this.extendedHours ? 0 : 6;
    for (let i = this.startHour; i < this.endHour; i++) {
      for (let j = 0; j < 2; j++) {
        this.intervals.push({
          sub: j,
          hour: i
        });
      }
    }
  }

  setExtendedHours(newVal: boolean) {
    this.extendedHours = newVal;
    this.generateIntervals();
    this._columnHeight = Math.floor(this._height / this.intervals.length);

  }

  @Input() set height(h: number) {
    this._height = h;
    this._columnHeight = Math.ceil(h / this.intervals.length);
  }

  @Input() set events(e: CalendarEvent[]) {
    this._events = e;
    if (this.date && e) {
      let duration = moment.duration(this.end.diff(this.start));

      let allDayEvents = [];
      let timedEvents = [];
      for (const calendarEvent of e) {
        if (calendarEvent.allDay) {
          allDayEvents.push(calendarEvent);
        } else {
          timedEvents.push(calendarEvent);
        }
      }
      console.log('alldayevents', allDayEvents);
      console.log('timedEvents', timedEvents);

      this.processDayLongEvents(duration, allDayEvents);
      this.processTimedEvents(duration, timedEvents);
    }
  }

  private processDayLongEvents(duration, allDayEvents) {
    let temp = this.start.clone();


    let eventsInWeek: EventInWeek[] = [];
    for (let i = 0; i < duration.asWeeks(); i++) {
      allDayEvents.sort((a, b) => {
        let first = a.start.valueOf();
        let second = a.end.valueOf();
        return first - second;
      });
      allDayEvents.forEach(e => eventsInWeek.push({
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
    this.dayLongEventsInWeek = eventsInWeek;
    let max_row = 0;
    for (const eventInWeek of eventsInWeek) {
      max_row = Math.max(max_row, eventInWeek.row);
    }
    if (eventsInWeek.length > 0) {
      this.dayLongEventHeight = (max_row + 1) * 21;
    } else {
      this.dayLongEventHeight = 0;
    }
  }

  private processTimedEvents(duration: moment.Duration, timedEvents: CalendarEvent[]) {
    console.log('start of week', this.start.toDate());
    let temp = this.start.clone();
    temp.second(0).minute(0).hour(0);


    let eventsInWeek: EventInDay[] = [];

    for (let day = 0; day < this.days; day++) {
      // eventsInWeek.push([]);
      timedEvents.filter(e => e.isInDay(temp));
      temp = temp.add(1, 'day');

      let eventsInDay = timedEvents.filter(e => e.isInDay(temp));

      eventsInDay.forEach(e => {
        let offset = e.getDayHourOffset(temp, this.hourSubdivision);
        if (!this.extendedHours) {
          offset -= 6 * this.hourSubdivision;
          if (offset < 0) {
            offset = 0;
          }
        }
        console.log('offset for ', e.title, 'day ', day, e.start.format('lll'), offset);
        if (offset !== undefined) {
          eventsInWeek.push({
            hourSlotOffset: offset,
            offsetInSlot: 0,
            length: e.getDayLengthInMinutes(temp, this.hourSubdivision, this.startHour, this.endHour),
            event: e,
            column: 0,
            maxColumn: 0,
            day: day,
            viewLeft: 0,
            viewTop: 0,
            viewWidth: 0,
            viewHeight: 0
          });
        }
      });
    }
    console.log(eventsInWeek);


    let copy = eventsInWeek.slice().sort((a, b) => {
      if (a.hourSlotOffset < b.hourSlotOffset) {
        return -1;
      } else if (a.hourSlotOffset > b.hourSlotOffset) {
        return 1;
      } else if (a.length > b.length) {
        return -1;
      } else if (a.length < b.length) {
        return 1;
      } else {
        return 0;
      }
    });

    let findCompanion = (master: EventInDay, all: EventInDay[]): EventInDay | undefined => {
      let candidates = all.filter(e => e.hourSlotOffset > (master.hourSlotOffset + master.length - 1));
      candidates.sort((a, b) => {
        return b.length - a.length;
      });
      if (candidates.length > 0) {
        return candidates[0];
      } else {
        return undefined;
      }
    };

    let daySlots: DaySlots[] = [];
    for (let i = 0; i < this.days; i++) {
      daySlots.push(new DaySlots(this.hourSubdivision, this.startHour, this.endHour));
    }
    while (copy.length > 0) {
      let event = copy.splice(0, 1)[0];
      let dayslot = daySlots[event.day];
      dayslot.addEvent(event);

      for (let next = findCompanion(event, copy); copy.length > 0 && next !== undefined; next = findCompanion(next, copy)) {
        let index = copy.indexOf(next);
        let tmp = copy.splice(index, 1)[0];
        dayslot.addEvent(tmp);
      }
    }
    eventsInWeek.forEach(e => {
      let dayPercentage = 100 / 7;
      e.viewWidth = dayPercentage / (e.maxColumn + 1);
      e.viewWidth -= 1;
      e.viewTop = 5 + e.hourSlotOffset * this._columnHeight;
      let offsetInColumn = e.column === 0 ? 0 : dayPercentage / (e.column + 1);
      e.viewLeft = e.day === 0 ? 0 + offsetInColumn : ((dayPercentage * e.day) + offsetInColumn);
      e.viewHeight = e.length * this._columnHeight;
    });
    this.eventsInWeek = eventsInWeek;
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
    this.title = this.start.format(sameMonth ? 'D - ' : 'D MMM - ') +
      this.end.format('D MMM, YYYY') +
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

  onPrevWeek() {
    let newDate = this._date.clone();
    newDate = newDate.subtract(7, 'day');
    this.newDate.emit(newDate);
  }

  onNextWeek() {
    let newDate = this._date.clone();
    newDate = newDate.add(7, 'day');
    this.newDate.emit(newDate);
  }

}
