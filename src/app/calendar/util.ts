import * as moment from 'moment';
import CalendarEvent from './CalendarEvent';

export interface Day {
  date: moment.Moment,
}

export interface EventInDay {
  hourSlotOffset: number;
  offsetInSlot: number;
  length: number;
  event: CalendarEvent;
  column: number;
  maxColumn: number;
  day: number;
  viewLeft: number,
  viewTop: number,
  viewWidth: number,
  viewHeight: number,
}

export interface EventInWeek {
  offset: number;
  length: number;
  event: CalendarEvent;
  row: number;
}

class HourSlot {
  columns: (EventInDay | undefined)[] = [];

  addEvent(event: EventInDay, column: number) {
    this.columns[column] = event;
    event.column = column;
    this.columns.forEach(e => {
      e.maxColumn = Math.max(column, e.column);
    });
  }

  getFreeColumn(minColumn: number): number {
    minColumn = Math.max(0, minColumn);
    for (let i = this.columns.length; i <= minColumn; i++) {
      this.columns.push(undefined);
    }
    if (this.columns[minColumn] === undefined) {
      return minColumn;
    } else {
      this.columns.push(undefined);
      return this.columns.length - 1;
    }
  }
}

class WeekDaySlots {
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

export class DaySlots {
  hourSlots: HourSlot[] = [];


  constructor(subdivisionPerHour: number, startHour: number, endHour: number) {
    for (let hour = startHour; hour < endHour; hour++) {
      for (let i = 0; i < subdivisionPerHour; i++) {
        this.hourSlots.push(new HourSlot());
      }
    }
  }

  addEvent(event: EventInDay) {
    let column = -1;
    for (let i = event.hourSlotOffset; i < event.hourSlotOffset + Math.floor(event.length); i++) {
      let cur = this.hourSlots[event.hourSlotOffset].getFreeColumn(column);
      column = Math.max(column, cur);
    }
    for (let i = event.hourSlotOffset; i < event.hourSlotOffset + Math.floor(event.length); i++) {
      this.hourSlots[i].addEvent(event, column);
    }
  }
}

export class WeekSlots {
  days: WeekDaySlots[] = [];


  constructor() {
    for (let i = 0; i < 7; i++) {
      this.days.push(new WeekDaySlots());
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