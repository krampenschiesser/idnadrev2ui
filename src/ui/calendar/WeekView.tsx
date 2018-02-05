import * as React from 'react';
import { observer } from 'mobx-react';
import CalendarEvent from './CalendarEvent';
import moment from 'moment';
import './calendar.css';

export interface WeekViewProps {
  events: CalendarEvent[];
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export interface WeekHeaderProps {
  startDate: moment.Moment;
  days: number;
}

class WeekHeader extends React.Component<WeekHeaderProps, object> {
  render() {
    const start = this.props.startDate;
    const days = this.props.days;
    let now = start.clone();

    const cellWidth = 100 / (days + 1);
    const cellStyle = {display: 'flex', flexGrow: 1, flexBasis: '' + cellWidth + '%', width: '100%'};

    let dayColumns = [];
    for (let i = 0; i < days; i++) {
      dayColumns.push(<div style={cellStyle} className='weekHeaderDate' key={now.format()}>{now.format('ddd, L')}</div>);
      now.add(1, 'days');
    }
    return (
      <div style={{display: 'flex', width: '100%'}} className='weekHeader'>
        <div style={cellStyle} className='weekHeaderGap'/>
        {dayColumns}
      </div>
    );
  }
}

interface TimeSlotLabelProps {
  hour: number;
  height: number;
}

class TimeSlotLabel extends React.Component<TimeSlotLabelProps, object> {
  render() {
    let label = moment().hour(this.props.hour).format('HH:00 A');
    const key = 'timeslotlabel-' + this.props.hour;
    const style = {flex: '1 0 0'};
    return (
      <div key={key} style={{display: 'flex', flexFlow: 'column nowrap', flexGrow: 1, minHeight: 40, flexBasis: '' + this.props.height + '%'}}>
        <div style={style} className='emptySlot'><span>{label}</span></div>
        <div style={style} className='emptySlot'/>

      </div>
    );
  }
}

class EmptySlot extends React.Component<TimeSlotLabelProps, object> {
  render() {
    const key = 'emptySlot-' + this.props.hour;
    const style = {flex: '1 0 0'};
    return (
      <div key={key} style={{display: 'flex', flexWrap: 'nowrap', flexFlow: 'column nowrap', flexGrow: 1, minHeight: 40, flexBasis: '' + this.props.height + '%'}}>
        <div style={style} className='emptySlot'/>
        <div style={style} className='emptySlot'/>
      </div>
    );
  }
}

interface WeekEventProps {
  event: CalendarEvent;
}

class WeekEvent extends React.Component<WeekEventProps, object> {
  render() {
    let start = this.props.event.start;
    let end = this.props.event.end;
    let startInMin = start.clone().hours() * 60 + start.minutes();
    let endInMin = end.clone().hours() * 60 + end.minutes();

    const duration = endInMin - startInMin;
    const top = 100 / (24 * 60) * startInMin;
    const height = 100 / (24 * 60) * duration;

    return (
      <div
        style={{
          backgroundColor: 'red',
          display: 'flex',
          top: '' + top + '%',
          height: '' + height + '%',
          left: '0%',
          width: '100%',
          position: 'absolute',
        }}/>
    );
  }
}

@observer
export default class WeekView extends React.Component<WeekViewProps, object> {

  render() {
    // const dates = {startDate: this.props.startDate, endDate: this.props.endDate};
    const start = this.props.startDate.hour(0).minute(0).second(0).millisecond(0);
    const end = this.props.endDate.hour(23).minute(59).second(59).millisecond(999);

    let days = start.diff(end, 'days');
    days = Math.abs(days === 0 ? 1 : days);

    let timeSlotLabels = [];
    let emptySlots = [];

    for (let i = 0; i < 24; i++) {
      timeSlotLabels.push(<TimeSlotLabel key={i} height={100 / 24} hour={i}/>);
      emptySlots.push(<EmptySlot key={i} height={100 / 24} hour={i}/>);
    }
    const cellWidth = 100 / (days + 1);

    let mainChildren: React.ReactElement<object>[][] = [];
    for (let i = 0; i < days; i++) {
      let dayStart = start.clone().add(i, 'days');
      let dayEnd = start.clone().add(i, 'days').hour(23).minute(59).second(59).millisecond(999);
      let renderDays = this.renderDays(dayStart, dayEnd, this.props.events);

      let items: React.ReactElement<object>[] = [];
      emptySlots.forEach(e => items.push(e));
      renderDays.forEach(e => items.push(e));
      mainChildren.push(items);
    }

    return (
      <div style={{flexWrap: 'wrap', display: 'flex'}} className='weekView'>
        <WeekHeader startDate={start} days={days}/>
        <div style={{position: 'relative', display: 'flex', flexWrap: 'wrap', flexGrow: 1}}>
          <div
            className='currentTimeIndicator' style={{
            display: 'block',
            right: '0px',
            left: '71px',
            top: '126px',
            position: 'absolute',
            zIndex: 1
          }}/>

          <div style={{flexWrap: 'wrap', flexDirection: 'column', flexGrow: 1, flexBasis: '' + cellWidth + '%'}}>
            {timeSlotLabels}
          </div>

          {mainChildren.map(c => {
            return (
              <div key={mainChildren.indexOf(c)} style={{flexDirection: 'column', flexGrow: 1, flexBasis: '' + cellWidth + '%', position: 'relative'}}>
                {c}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private renderDays(dayStart: moment.Moment, dayEnd: moment.Moment, events: CalendarEvent[]): React.ReactElement<object>[] {
    let todaysEvents = events.filter(e => {
      return e.end.isBefore(dayEnd) && e.end.isAfter(dayStart);
    });
    return todaysEvents.map(e => <WeekEvent key={e.title} event={e}/>);
  }
}
