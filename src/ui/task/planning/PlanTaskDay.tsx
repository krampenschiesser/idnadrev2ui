import * as React from 'react';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../../store/UiStore';
import Task from '../../../dto/Task';
import { TaskFilter } from '../../../store/TaskFilter';
import * as moment from 'moment';
import BigCalendar from 'react-big-calendar';

BigCalendar.momentLocalizer(moment);

export interface PlanTaskDayViewProps {
  tasks: Task[];
  date: Date;
  fullDate: boolean;
  store: GlobalStore;
  uiStore: UiStore;
}

class Event {
  id: string;
  title: string;
  allDay: boolean = false;
  start: Date;
  end: Date;
  task: Task;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.name;
    let proposedDate = task.getProposedDate();
    let scheduledDate = task.getScheduledDate();
    if (scheduledDate) {
      let end = moment(scheduledDate).add(task.details.estimatedTime ? task.details.estimatedTime : 30 * 60, 'seconds');
      this.start = scheduledDate;
      this.end = end.toDate();
    }
    if (proposedDate) {
      let end = moment(proposedDate).add(task.details.estimatedTime ? task.details.estimatedTime : 30 * 60, 'seconds');
      this.start = proposedDate;
      this.end = end.toDate();
    }
    this.task = task;
  }
}

@observer
export default class PlanTaskDayView extends React.Component<PlanTaskDayViewProps, object> {
  @observable tasks: Task[] = [];
  @observable previewTask: Task | null = null;

  filter: TaskFilter = {finished: false};

  componentWillMount() {
    this.props.uiStore.header = 'Plan Tasks';
  }

  moveDate = (event: Event, start: moment.Moment, end: moment.Moment) => {
    console.log('moved ', event, start, end);
  };
  resizeDate = (event: Event, start: moment.Moment, end: moment.Moment) => {
    console.log('moved ', event, start, end);

  };

  render() {
    // let date = moment(this.props.date);
    // let title = date.format('ddd, D');

    // let events = this.props.tasks.filter(t => t.getProposedDate() || t.getScheduledDate()).map(t => new Event(t));

    // const startDay = moment(this.props.date).clone().hour(0).minute(0).second(0).millisecond(0);
    // const endDay = moment(this.props.date).clone().hour(23).minute(59).second(59).millisecond(999);

    return (
      <div/>
    );
  }

  getTasksStartingBetween(start: moment.Moment, end: moment.Moment): Task[] {
    return this.props.tasks.filter(t => {
      if (t.getProposedDate() !== undefined) {
        return moment(t.getProposedDate()).isBetween(start, end);
      } else if (t.getScheduledDate() !== undefined) {
        return moment(t.getScheduledDate()).isBetween(start, end);
      } else {
        return false;
      }
    });
  }
}
