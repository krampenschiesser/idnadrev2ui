import * as moment from 'moment';

export default class CalendarEvent {
  id: string;
  title: string;
  color?: string;
  allDay?: boolean;
  start: moment.Moment;
  end: moment.Moment;

  isInWeek(date: moment.Moment): boolean {
    let weekStart = date.clone().startOf('week');
    let weekEnd = date.clone().endOf('week');
    console.log(this.title, 'WeekStart', weekStart.toDate(), 'WeekEnd', weekEnd.toDate(), 'Start', this.start.toDate(), 'End', this.end.toDate());

    let endIsInWeek = (this.end.isSameOrAfter(weekStart) && this.end.isSameOrBefore(weekEnd));
    let startIsInWeek = (this.start.isSameOrAfter(weekStart) && this.start.isSameOrBefore(weekEnd));
    let spansOverWeek = (this.start.isBefore(weekStart) && this.end.isAfter(weekEnd));
    return endIsInWeek
      || startIsInWeek
      || spansOverWeek;
  }

  getWeekIndex(date: moment.Moment): number | undefined {
    let weekStart = date.clone().startOf('week');
    let weekEnd = date.clone().endOf('week');

    if (!this.isInWeek(date)) {
      return undefined;
    } else if (this.start.isSameOrAfter(weekStart) && this.start.isSameOrBefore(weekEnd)) {
      let weekDay = this.start.weekday();
      console.log('weekday for ', this.title, weekDay);
      return weekDay;
    } else {
      return 0;
    }
  }

  getWeekLength(date: moment.Moment): number | undefined {
    let weekStart = date.clone().startOf('week');
    let weekEnd = date.clone().endOf('week');
    let weekIndex = this.getWeekIndex(date);

    if (weekIndex === undefined) {
      return undefined;
    } else if (this.end.isSameOrAfter(weekEnd)) {
      return 7 - weekIndex;
    } else {
      return this.end.weekday() + 1 - weekIndex;
    }
  }
}