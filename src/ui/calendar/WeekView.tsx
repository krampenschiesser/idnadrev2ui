import * as React from 'react';
import { observer } from 'mobx-react';
import CalendarEvent from './CalendarEvent';
import moment from 'moment';
import './calendar.css';
import Tooltip from 'antd/lib/tooltip';
import {
  DropTarget,
  ConnectDragSource,
  DragSourceSpec,
  DragSource,
  DndComponentClass,
  DragSourceMonitor,
  DragSourceConnector, ConnectDropTarget, DropTargetSpec, DropTargetMonitor, DropTargetConnector
} from 'react-dnd';

// import DropTargetConnector = __ReactDnd.DropTargetConnector;
// import DropTargetMonitor = __ReactDnd.DropTargetMonitor;
// import DropTargetSpec = __ReactDnd.DropTargetSpec;
// import ConnectDropTarget = __ReactDnd.ConnectDropTarget;

export interface WeekViewProps {
  events: CalendarEvent[];
  startDate: moment.Moment;
  endDate: moment.Moment;
  timeLabelWidth?: number;
}

export interface WeekHeaderProps {
  startDate: moment.Moment;
  days: number;
  timeLabelWidth: number;
}

class WeekHeader extends React.Component<WeekHeaderProps, object> {
  render() {
    const start = this.props.startDate;
    const days = this.props.days;
    let now = start.clone();

    const cellWidth = 100 / (days + 1);
    // const cellStyle = {display: 'flex', flexGrow: 1, flexBasis: '' + cellWidth + '%', width: '100%', minWidth: 75, flexDirection: 'column'};

    let dayColumns = [];
    for (let i = 0; i < days; i++) {
      let item = (
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            flexBasis: '' + cellWidth + '%',
            width: '100%',
            minWidth: 75,
            flexDirection: 'column'
          }} className='weekHeaderDate' key={now.format()}>
          <span
            className={'weekDayTitle' + this.getTitleExtension(now)}
            style={{width: '100%'}}>{now.format('ddd')}</span>
          <span
            className={'weekDayTitleDate' + this.getTitleExtension(now)}
            style={{width: '100%'}}>{now.format('D')}</span>
        </div>
      );
      dayColumns.push(item);
      now.add(1, 'days');
    }
    let utcPositive = moment().utcOffset() > 0;
    let utcString = 'GMT' + (utcPositive ? '+' : '') + moment().utcOffset() / 60;
    return (
      <div style={{display: 'flex', width: '100%'}} className='weekHeader'>
        <div
          style={{
            display: 'flex',
            flexGrow: 0,
            flexBasis: this.props.timeLabelWidth + 'px',
            width: this.props.timeLabelWidth + 'px',
            flexDirection: 'column'
          }} className='weekHeaderGap'>
          <span className='weekNumber'>{moment().week()}</span>
          <span style={{fontSize: 'smaller'}}>{utcString}</span>
        </div>
        {dayColumns}
      </div>
    );
  }

  private getTitleExtension(now: moment.Moment): string {
    if (now.isAfter(moment().hours(23).minute(59).second(59).millisecond(999))) {
      return 'Future';
    } else if (now.isBefore(moment().hours(0).minute(0).second(0).millisecond(0))) {
      return 'Past';
    } else {
      return 'Now';
    }
  }
}

interface TimeSlotLabelProps {
  hour: number;
  height: number;
  width: number;
}

class TimeSlotLabel extends React.Component<TimeSlotLabelProps, object> {
  render() {
    let label = moment().hour(this.props.hour).format('HH:00');
    const key = 'timeslotlabel-' + this.props.hour;
    const style = {flex: '1 0 0'};
    return (
      <div
        key={key} style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        flexGrow: 0,
        minHeight: 40,
        flexBasis: '' + this.props.height + '%',
        width: this.props.width,
      }}>
        <div style={style} className='emptySlot'><span>{label}</span></div>
        <div style={style} className='emptySlot'/>

      </div>
    );
  }
}

interface EmptySlotProps {
  hour: number;
  minute: number;
  height: number;
  dayStart: moment.Moment;
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
}

class EmptySlot extends React.Component<EmptySlotProps, object> {
  render() {
    const key = 'emptySlot-' + this.props.hour;
    const className = this.props.isOver ? 'emptySlotOver' : 'emptySlot';
    if (this.props.connectDropTarget) {
      return this.props.connectDropTarget(
        <div
          className={className}
          key={key}
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexFlow: 'column nowrap',
            flexGrow: 1,
            minHeight: 20,
            flexBasis: '' + this.props.height + '%',
            minWidth: 75
          }}/>
      );
    } else {
      return <h1>Error</h1>;
    }
  }
}

interface DropSlotResult {
  date: moment.Moment;
  hour: number;
  minute: number;
}

let emptySlotSpec: DropTargetSpec<EmptySlotProps> = {
  drop: (props: EmptySlotProps, monitor: DropTargetMonitor, component: React.Component<EmptySlotProps>): DropSlotResult => {
    console.log('dropped', monitor.getItem(), monitor.getDropResult(), component.props);
    return ({
      date: props.dayStart.clone(),
      hour: props.hour,
      minute: props.minute,
    });
  },
};
let emptySlotCollector = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

const EmptySlotDraggable: DndComponentClass<EmptySlotProps> = DropTarget('event', emptySlotSpec, emptySlotCollector)(EmptySlot);

interface WeekEventProps {
  event: CalendarEvent;
  weekStart: moment.Moment;
  weekEnd: moment.Moment;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  cellWidth: number;
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

    let title = this.props.event.title;
    let timeDisplay = start.format('D, HH:mm') + ' - ' + end.format('D, HH:mm');
    if (!this.props.connectDragSource) {
      return <h1>Error weekevent</h1>;
    } else {
      if (this.props.event.wholeDay) {
        let curStart = this.props.event.start.isBefore(this.props.weekStart) ? this.props.weekStart : this.props.event.start;
        let curEnd = this.props.event.end.isAfter(this.props.weekEnd) ? this.props.weekEnd : this.props.event.end;

        let days = curEnd.dayOfYear() - curStart.dayOfYear() + 1;

        return this.props.connectDragSource((
          <div
            className='wholeDayEventSlot' style={{
            width: '100%',
            flexBasis: '' + this.props.cellWidth * days + '%',
            flexGrow: 1,
          }}>
            <Tooltip title={timeDisplay + '\n' + title}>
              <div
                className='weekEvent'
                style={{
                  width: '100%',
                  flexBasis: '' + this.props.cellWidth * days + '%',
                  flexGrow: 1,
                }}>
                <div style={{flexGrow: 1}} className='weekEventDate'>
                  {timeDisplay}
                </div>
                <div style={{flexGrow: 1}} className='weekEventText'>
                  {title}
                </div>
              </div>
            </Tooltip>
          </div>
        ));
      } else {
        return this.props.connectDragSource((
          <div>
            <Tooltip title={timeDisplay + '\n' + title}>
              <div
                className='weekEvent'
                style={{
                  display: 'flex',
                  top: '' + top + '%',
                  height: '' + height + '%',
                  left: '0%',
                  width: '100%',
                  position: 'absolute',
                  flexFlow: 'column wrap',
                  alignItems: 'flex-start',
                  overflow: 'hidden',
                  minWidth: 75
                }}>
                <div style={{flexGrow: 1}} className='weekEventDate'>
                  {timeDisplay}
                </div>
                <div style={{flexGrow: 1}} className='weekEventText'>
                  {title}
                </div>
              </div>
            </Tooltip>
          </div>
        ));
      }
    }
  }
}

let weekEventSpec: DragSourceSpec<WeekEventProps,{}> = {
  beginDrag: (props: WeekEventProps) => {
    console.log('begin drag');
    return ({});
  },
  endDrag: (props: WeekEventProps, monitor: DragSourceMonitor) => {
    // tslint:disable-next-line
    let dropResult: any = monitor.getDropResult();
    if (dropResult && 'hour' in dropResult) {
      let slot: DropSlotResult = dropResult;

      let event = {
        hour: slot.hour,
        minute: slot.minute,
        date: slot.date,
      };
      props.event.reschedule(event);
    }
  }
};
let weekEventCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const WeekEventDraggable: DndComponentClass<WeekEventProps> = DragSource('event', weekEventSpec, weekEventCollector)(WeekEvent);

interface TimeIndicatorProps {
  offset: number;
}

class TimeIndicator extends React.Component<TimeIndicatorProps, object> {
  render() {
    let now = moment();
    let startInMin = now.hours() * 60 + now.minutes();

    const top = 100 / (24 * 60) * startInMin;

    return (
      <div
        className='currentTimeIndicator' style={{
        display: 'block',
        right: '0px',
        left: this.props.offset,
        top: top + '%',
        position: 'absolute',
        zIndex: 1
      }}/>
    );
  }
}

interface DayLongEventsProps {
  events: CalendarEvent[];
  startDate: moment.Moment;
  endDate: moment.Moment;
  timeLabelWidth?: number;
  days: number;
}

class DayLongEvents extends React.Component<DayLongEventsProps, object> {

  static getDaySpan(event: CalendarEvent, weekStart?: moment.Moment, weekEnd?: moment.Moment): number {
    if (weekStart && weekEnd) {
      return Math.min(weekEnd.dayOfYear(), event.end.dayOfYear()) - Math.max(weekStart.dayOfYear(), event.start.dayOfYear()) + 1;
    } else {
      return event.end.dayOfYear() - event.start.dayOfYear() + 1;
    }
  }

  render() {
    // const start = this.props.startDate;
    // const end = this.props.endDate;
    const days = this.props.days;

    const cellWidth = 100 / (days);

    let singleDayEvents = this.props.events.filter(t => t.wholeDay).filter(t => t.start.dayOfYear() === t.end.dayOfYear());
    let multiDayEvents = this.props.events.filter(t => t.wholeDay).filter(t => t.start.dayOfYear() !== t.end.dayOfYear());
    multiDayEvents.sort((cur, other) => {
      let daysCur = DayLongEvents.getDaySpan(cur);
      let daysOther = DayLongEvents.getDaySpan(other);
      return daysOther - daysCur; //reverse
    });

    let eventRows: CalendarEvent[][] = [];
    while (multiDayEvents.length > 0) {
      let event = multiDayEvents.shift();
      if (event) {
        let found: CalendarEvent[] = [];
        found.push(event);

        this.fillNonIntersecting(found, multiDayEvents);
        this.fillNonIntersecting(found, singleDayEvents);

        eventRows.push(found);
      }
    }
    while (singleDayEvents.length > 0) {
      let event = singleDayEvents.shift();
      if (event) {
        let found: CalendarEvent[] = [];
        found.push(event);
        this.fillNonIntersecting(found, singleDayEvents);
        eventRows.push(found);
      }
    }

    let weekStart = this.props.startDate;
    let weekEnd = this.props.endDate;
    let rows = [];
    for (let events of eventRows) {

      let children = [];
      for (let day = 0; day < days;) {
        let start = weekStart.clone().add(day, 'day');
        let end = start.clone().hour(23).minute(59).second(59).millisecond(999);

        let eventIndex = events.findIndex(e => {
          let endsToday = e.end.isBetween(start, end, undefined, '[]');
          let startsToday = e.start.isBetween(start, end, undefined, '[]');
          let spansToday = DayLongEvents.getDaySpan(e) > 1 && e.start.isBefore(start);
          return startsToday || endsToday || spansToday;
        });

        if (eventIndex >= 0) {
          let event = events[eventIndex];
          events.splice(eventIndex, 1);
          let daySpan = DayLongEvents.getDaySpan(event, weekStart, weekEnd);
          start.add(daySpan, 'day');
          day += daySpan;
          children.push(<WeekEventDraggable weekStart={weekStart} weekEnd={this.props.endDate} key={'' + rows.length + '-' + day} cellWidth={cellWidth} event={event}/>);
        } else {
          day++;
          children.push((
            <div
              className='wholeDayEventSlot' key={'' + rows.length + '-' + day}
              style={{flexBasis: '' + cellWidth + '%', flexGrow: 1, width: '100%'}}/>
          ));
        }
      }
      rows.push((
        <div key={rows.length} style={{display: 'flex', flexDirection: 'row', flexGrow: 1, width: '100%'}}>
          {children}
        </div>
      ));
    }

    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'row'}}>
        <div
          className='wholeDayEventSlot'
          key='emptySlot' style={{
          width: this.props.timeLabelWidth,
        }}/>
        <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
          {rows}
        </div>
      </div>
    );
  }

  private fillNonIntersecting(toFill: CalendarEvent[], toSearch: CalendarEvent[]) {
    for (let next = this.findNextNonIntersecting(toFill, toSearch); next[0] !== undefined; next = this.findNextNonIntersecting(toFill, toSearch)) {
      let ev: CalendarEvent | undefined = next[0];
      let index: number = next[1];
      if (ev) {
        toFill.push(ev);
        toSearch.splice(index, 1);
      }
    }
  }

  private findNextNonIntersecting(current: CalendarEvent[], candidates: CalendarEvent[]): [CalendarEvent | undefined, number] {
    let index = candidates.findIndex(e => {
      if (e === undefined) {
        return false;
      }

      for (let cur of current) {
        let intersects = this.intersectsDayBase(cur, e);
        if (intersects) {
          return false;
        }
      }
      return true;
    });

    if (index >= 0) {
      return [candidates[index], index];
    } else {
      return [undefined, index];
    }
  }

  private intersectsDayBase(event: CalendarEvent, other: CalendarEvent): boolean {
    let intersects = other.start.isBetween(event.start, event.end, 'day', '[]') || other.end.isBetween(event.start, event.end, 'day', '[]');
    return intersects;
  }
}

@observer
export default class WeekView extends React.Component
  <WeekViewProps, object> {
  render() {
    const timeLabelWidth = this.props.timeLabelWidth ? this.props.timeLabelWidth : 50;
    const start = this.props.startDate.hour(0).minute(0).second(0).millisecond(0);
    const end = this.props.endDate.hour(23).minute(59).second(59).millisecond(999);

    let days = end.diff(start, 'days');
    days = Math.abs(days) + 1;

    let timeSlotLabels = [];
    for (let j = 0; j < 24; j++) {
      timeSlotLabels.push(<TimeSlotLabel width={timeLabelWidth} key={j} height={100 / 24} hour={j}/>);
    }
    const cellWidth = 100 / (days);

    let mainChildren: React.ReactElement<object>[][] = [];
    for (let i = 0; i < days; i++) {
      let dayStart = start.clone().add(i, 'days');
      let emptySlots = [];
      for (let j = 0; j < 48; j++) {
        emptySlots.push((
          <EmptySlotDraggable
            key={'' + i + '-' + j} height={100 / 48} dayStart={dayStart.clone()}
            hour={Math.trunc(j / 2)} minute={j % 2 === 1 ? 30 : 0}/>
        ));
      }
      let dayEnd = start.clone().add(i, 'days').hour(23).minute(59).second(59).millisecond(999);
      let eventsRendered = this.renderDaysEvents(dayStart, dayEnd, this.props.events, cellWidth, start, end);

      let items: React.ReactElement<object>[] = [];
      emptySlots.forEach(e => items.push(e));
      eventsRendered.forEach(e => items.push(e));
      mainChildren.push(items);
    }

    return (
      <div style={{flexWrap: 'wrap', display: 'flex', flexDirection: 'column'}} className='weekView'>
        <WeekHeader timeLabelWidth={timeLabelWidth} startDate={start} days={days}/>
        <DayLongEvents
          timeLabelWidth={timeLabelWidth} events={this.props.events} startDate={start} endDate={end}
          days={days}/>
        <div style={{position: 'relative', display: 'flex', flexGrow: 1}}>
          <TimeIndicator offset={timeLabelWidth}/>

          <div style={{flexWrap: 'wrap', flexDirection: 'column', flexGrow: 0, flexBasis: '' + timeLabelWidth + 'px'}}>
            {timeSlotLabels}
          </div>

          {mainChildren.map(c => {
            return (
              <div
                key={mainChildren.indexOf(c)} style={{
                flexDirection: 'row',
                flexGrow: 1,
                flexBasis: '' + cellWidth + '%',
                position: 'relative'
              }}>
                {c}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private renderDaysEvents(dayStart: moment.Moment, dayEnd: moment.Moment, events: CalendarEvent[], cellWidth: number, start: moment.Moment, end: moment.Moment): React.ReactElement<object>[] {
    let todaysEvents = events.filter(e => !e.wholeDay).filter(e => {
      return e.end.isBefore(dayEnd) && e.end.isAfter(dayStart);
    });
    return todaysEvents.map(e => {
      return (
        <WeekEventDraggable weekStart={start} weekEnd={end} key={e.title} event={e} cellWidth={cellWidth}/>
      );
    });
  }
}
