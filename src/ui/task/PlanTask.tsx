import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../store/UiStore';
import Task from '../../dto/Task';
import { TaskFilter } from '../../store/TaskFilter';
import Calendar, { CalendarMode } from 'antd/lib/calendar';
import * as moment from 'moment';

export interface PlanTaskProps {
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
export default class PlanTask extends React.Component<PlanTaskProps, object> {
  @observable tasks: Task[];
  @observable previewTask: Task | null = null;

  filter: TaskFilter = {finished: false};

  componentWillMount() {
    this.props.uiStore.header = 'Plan Tasks';
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

  showMarkdownPreview = (task: Task) => {
    this.previewTask = task;
  };

  dateCellRender = (date: moment.Moment) => {
    return <div/>;
  };

  monthCellRender = (date: moment.Moment) => {
    return <div/>;
  };

  onSelect = (date?: moment.Moment) => {
    //
  };

  onPanelChange = (date?: moment.Moment, mode?: CalendarMode) => {
//
  };

  render() {
    // let markdownHover = (name: string, record: Task, index: number) => {
    //   return <HoverCell onHover={() => this.showMarkdownPreview(record)}>{name}</HoverCell>;
    // };
    return (
      <div>
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onPanelChange={this.onPanelChange}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}
