import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../store/UiStore';
import Task from '../../dto/Task';
import { TaskFilter } from '../../store/TaskFilter';
import WeekView from '../calendar/WeekView';
import * as moment from 'moment';
import CalendarEvent from '../calendar/CalendarEvent';

export interface PlanTaskProps {
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
export default class PlanTask extends React.Component<PlanTaskProps, object> {
  @observable tasks: Task[] = [];
  @observable previewTask: Task | null = null;
  @observable date: Date = new Date();

  filter: TaskFilter = {finished: false};

  componentWillMount() {
    this.props.uiStore.header = 'Plan Tasks';
    this.date = new Date();
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.props.store.getTasks(this.filter).then((t: Task[]) => {
      this.tasks = [];
      this.tasks = t;
      if (t.length === 0) {
        this.previewTask = null;
      }
    }).catch(e => {
      console.error('Could not load tasks', e);
      console.error(e);
    });
  };

  render() {
    let firstOfWeek = moment().day(0).hour(0).minute(0).second(0).millisecond(0);
    let lastOfWeek = moment().day(7).hour(23).minute(59).second(59).millisecond(999);

    let events: CalendarEvent[] = [];

    this.tasks.filter((t) => t.isInDateRange(firstOfWeek, lastOfWeek)).map(t => {

      return {
        start: date,
        end: end,
        title: 'Event' + (i + 1),
        reschedule: (date2, hour, minute) => {

        }
      };
    }).forEach(e => events.push(e));

    return (
      <div>
        <WeekView events={events} startDate={firstOfWeek} endDate={lastOfWeek}/>
      </div>
    );
  }
}
