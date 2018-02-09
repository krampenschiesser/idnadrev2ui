import * as React from 'react';
import moment from 'moment';

export interface RescheduleDateTime {
  date: moment.Moment;
  hour: number;
  minute: number;
}
export interface RescheduleDate {
  date: moment.Moment;
  weekLong: boolean;
}
export default interface CalendarEvent {
  start: moment.Moment;
  end: moment.Moment;
  wholeDay?: boolean;
  wholeWeek?: boolean;
  title: string;
  details?: React.Component;
  onClick?: (event: CalendarEvent) => void;
  onNewStart?: (event: CalendarEvent, newStart: moment.Moment) => void;
  onResize?: (event: CalendarEvent, newStart: moment.Moment, newEnd: moment.Moment) => void;

  reschedule: (dateTime?: RescheduleDateTime, rescheduleDate?: RescheduleDate) => void;
}