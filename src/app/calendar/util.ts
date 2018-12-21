import * as moment from 'moment';
import CalendarEvent from './CalendarEvent';

export interface Day {
  date: moment.Moment,
}

export interface EventInWeek {
  offset: number;
  length: number;
  event: CalendarEvent;
  row: number;
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

export class WeekSlots {
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