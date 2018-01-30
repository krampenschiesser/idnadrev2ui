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
  @observable tasks: Task[] = [];
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
      console.log('reloaded')
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
    if (this.tasks.length === 0) {
      return;
    }
    const start = date.clone().hour(0).minute(0).second(0).millisecond(0);
    const end = date.clone().hour(23).minute(59).second(59).millisecond(999);

    let todaysTasks = this.tasks.filter(t => {
      if (t.getProposedDate() !== undefined) {
        console.log('Got proposed', start.toDate(), end.toDate(), t.getProposedDate());
        return moment(t.getProposedDate()).isBetween(start, end);
      } else if (t.getScheduledDate() !== undefined) {
        console.log('Got scheduled', start.toDate(), end.toDate(), t.getScheduledDate());
        return moment(t.getScheduledDate()).isBetween(start, end);
      } else {
        return false;
      }
    });
    console.log(this.tasks);
    console.log(todaysTasks);
    let nodes = todaysTasks.map(t => <p key={t.id}>{t.name}</p>);
    return <div>{nodes}</div>;
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
    console.log(this.tasks)
    return (
      <div>
        <Calendar mode='month'
                  dateCellRender={this.dateCellRender}
                  monthCellRender={this.monthCellRender}
                  onPanelChange={this.onPanelChange}
                  onSelect={this.onSelect}
        />
      </div>
    );
  }
}
