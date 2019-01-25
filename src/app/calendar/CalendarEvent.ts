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

  isInDay(day: moment.Moment): boolean {
    let startOfDay = day.clone();
    let endOfDay = day.clone();
    startOfDay = startOfDay.startOf('day');
    endOfDay = endOfDay.endOf('day');

    if (this.start.isBefore(startOfDay) && this.end.isSameOrAfter(startOfDay)) {
      return true;
    }
    if (this.start.isSameOrAfter(startOfDay) && this.start.isSameOrBefore(endOfDay)) {
      return true;
    }
  }

  getDayHourOffset(day: moment.Moment, hourSubDivision: number): number | undefined {
    if (!this.isInDay(day)) {
      return undefined;
    }
    let startOfDay = day.clone();
    startOfDay = startOfDay.startOf('day');

    if (this.start.isSameOrBefore(startOfDay) && this.end.isSameOrAfter(startOfDay)) {
      return 0;
    }
    let hour = this.start.hour();
    let minute = this.start.minute();

    let subdivision = Math.floor(hourSubDivision / 60 * minute);
    return hour * hourSubDivision + subdivision;
  }

  getDayLengthInMinutes(day: moment.Moment, hourSubDivision: number, startHour: number, endHour: number): number {
    if (!this.isInDay(day)) {
      return 0;
    }
    let startOfDay = day.clone().startOf('day');
    let endOfDay = day.clone().endOf('day');
    if (startHour > 0) {
      startOfDay = startOfDay.add(startHour, 'hours');
    }
    if (endHour < 24) {
      endOfDay = endOfDay.subtract(24 - endHour, 'hours');
    }
    console.log('startofday: ',startOfDay.toDate().toLocaleString(), ' endOfDay: ',endOfDay.toDate().toLocaleString())
    let start = startHour *60;
    if (this.start.day() === day.day() && this.start.isSameOrAfter(startOfDay)) {
      start = this.start.hour() * 60 + this.start.minute();
    }
    let end = endHour * 60;
    if (this.end.day() === day.day() && this.end.isSameOrBefore(endOfDay)) {
      end = this.end.hour() * 60 + this.end.minute();
    }
    console.log('start: ', start, ' end: ', end, ' subdivision: ',hourSubDivision);
    let length = (end - start) / 60 * hourSubDivision;
    console.log('length of ', this.title, ': ', length);
    return length;
  }
}