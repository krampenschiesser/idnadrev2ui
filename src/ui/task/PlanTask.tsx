import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../store/UiStore';
import Task from '../../dto/Task';
import { TaskFilter } from '../../store/TaskFilter';
import PlanTaskDayView from './planning/PlanTaskDay';

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
      console.log('reloaded');
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
    return (
      <div>
        <PlanTaskDayView tasks={this.tasks} date={this.date} fullDate={false} store={this.props.store}
                         uiStore={this.props.uiStore}/>
      </div>
    );
  }
}
