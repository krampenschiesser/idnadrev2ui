import * as React from 'react';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../../store/UiStore';
import Task from '../../../dto/Task';
import { TaskFilter } from '../../../store/TaskFilter';
import * as moment from 'moment';
import Card from 'antd/lib/card';

export interface PlanTaskDayViewProps {
  tasks: Task[];
  date: Date;
  fullDate: boolean;
  store: GlobalStore;
  uiStore: UiStore;
}

@observer
export default class PlanTaskDayView extends React.Component<PlanTaskDayViewProps, object> {
  @observable tasks: Task[] = [];
  @observable previewTask: Task | null = null;

  filter: TaskFilter = {finished: false};

  componentWillMount() {
    this.props.uiStore.header = 'Plan Tasks';
  }

  render() {
    const height = this.props.uiStore.uiHeight / 4 * 3;
    const hourHeight = height / 24;
    console.log(height, hourHeight);
    let date = moment(this.props.date);
    let title = date.format('ddd, D');

    return (
      <div>

        <Card bodyStyle={{height: height}} title={date.format('ddd')}>
          <div style={{height: hourHeight, backgroundColor: 'red'}}>bla</div>
          <div style={{height: hourHeight, backgroundColor: 'yellow'}}>blubb</div>
        </Card>
      </div>
    );
  }
}
