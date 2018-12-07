import * as moment from 'moment';

export default interface CalendarEvent {
  id: string;
  title: string;
  color?: string;
  startDate: moment.Moment,
  endDate: moment.Moment,
}