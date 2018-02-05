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
    let now = moment();
    let week = moment().add(7, 'days');

    let events: CalendarEvent[] = [];

    for (let i = 0; i < 7; i++) {
      let date = now.clone().add(i, 'days');
      date.hour(Math.floor(Math.random() * 23));

      let duration: number = 15 + Math.floor(Math.random() * 90);
      let end = date.clone().add(duration, 'm');

      events.push({
        start: date,
        end: end,
        title: 'Event' + (i + 1),
      });
    }
    return (
      <div>
        <WeekView events={events} startDate={now} endDate={week}/>
      </div>
    );
  }
}
