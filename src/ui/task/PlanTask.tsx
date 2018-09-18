import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../store/UiStore';
import Task from '../../dto/Task';
import { TaskFilter } from '../../store/TaskFilter';
import WeekView from '../calendar/WeekView';
import * as moment from 'moment';
import CalendarEvent, { RescheduleDate, RescheduleDateTime } from '../calendar/CalendarEvent';
import { DatePicker } from 'antd';

const {RangePicker} = DatePicker;

export interface PlanTaskProps {
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
export default class PlanTask extends React.Component<PlanTaskProps, object> {
  @observable tasks: Task[] = [];
  @observable previewTask: Task | null = null;

  @observable startDate: moment.Moment = moment().day(0).hour(0).minute(0).second(0).millisecond(0);
  @observable endDate: moment.Moment = moment().day(6).hour(23).minute(59).second(59).millisecond(999);

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

  changeDateRange = (range: [moment.Moment, moment.Moment]) => {
    if (range && range[0]) {
      this.startDate = range[0];
      this.endDate = range[1];
    } else {
      this.startDate = moment().day(0).hour(0).minute(0).second(0).millisecond(0);
      this.endDate = moment().day(6).hour(23).minute(59).second(59).millisecond(999);
    }
  };

  render() {
    let events: CalendarEvent[] = [];

    this.tasks.filter((t) => t.isInDateRange(this.startDate, this.endDate)).map(t => {
      let [start, end] = t.getStartEnd();
      return {
        start: start.clone(),
        end: end.clone(),
        title: t.name,
        wholeDay: t.isWholeDay(),
        wholeWeek: t.isWholeWeek(),
        reschedule: (dateTime?: RescheduleDateTime, rescheduleDate?: RescheduleDate) => {

          //
        }
      };
    }).forEach(e => events.push(e));

    return (
      <div>
        <RangePicker defaultValue={[this.startDate, this.endDate]} onChange={this.changeDateRange}/>
        <WeekView events={events} startDate={this.startDate} endDate={this.endDate}/>
      </div>
    );
  }
}
