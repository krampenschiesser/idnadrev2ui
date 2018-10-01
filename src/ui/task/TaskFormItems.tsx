import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import Task, {
  Delegation,
  DelegationHistory, FixedScheduling, ProposedWeekDayYear, Scheduling, Seconds,
  TaskState
} from '../../dto/Task';
import Select from 'antd/lib/select';
import GlobalStore from '../../store/GlobalStore';
import { FormConstants } from '../form/FormConstants';
import AutoComplete from 'antd/lib/auto-complete';
import { FileId } from '../../dto/FileId';
import { FileType } from '../../dto/FileType';
import { IdnadrevFileSelection } from '../selection/IdnadrevFileSelection';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { observable } from 'mobx';
import InputNumber from 'antd/lib/input-number';
import Switch from 'antd/lib/switch';
import Icon from 'antd/lib/icon';
import UiStore from '../../store/UiStore';
import { DatePicker } from 'antd';
import moment from 'moment';
import TimePicker from 'antd/lib/time-picker';
import Input from 'antd/lib/input/Input';
import { ChangeEvent } from 'react';

const Option = Select.Option;

export interface TaskFormItemProps extends FormComponentProps {
  task: Task;
  store: GlobalStore;
  uiStore: UiStore;
  indent?: number;
  // tslint:disable-next-line
  antLocale?: any;
}

@observer
export class ContextFormItem extends React.Component<TaskFormItemProps, object> {
  context: string | undefined;
  allContexts: string[];

  componentDidMount() {
    this.context = this.props.task.context;
    this.allContexts = Array.from(this.props.store.getAllContexts());
    this.allContexts.sort();
  }

  onChange = (text: string) => {
    let value = text;
    if (value) {
      this.props.task.details.context = value;
      if (value === '') {
        this.props.task.details.context = undefined;
      }
    } else {
      this.props.task.details.context = undefined;
    }
  };

  render() {

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Context' colon={true}>
        {getFieldDecorator('context', {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }], //initialValue: this.context
        })(
          <AutoComplete dataSource={this.allContexts} style={{width: 150}} onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

@observer
export class TaskStateFormItem extends React.Component<TaskFormItemProps, object> {
  taskState: TaskState;

  componentDidMount() {
    this.taskState = this.props.task.state;
  }

  onChange = (text: TaskState) => {
    let value = text;
    if (value) {
      this.props.task.details.state = value;
    } else {
      this.props.task.details.state = TaskState.None;
    }
  };

  render() {
    let taskStates = [TaskState.None, TaskState.Asap, TaskState.Delegated, TaskState.Later];

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='State' colon={true}>
        {getFieldDecorator('state', {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }], initialValue: this.taskState
        })(
          <Select style={{width: 150}} onChange={this.onChange}>
            {taskStates.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        )}
      </FormItem>
    );
  }
}

@observer
export class TaskParentFormItem extends React.Component<TaskFormItemProps, object> {
  @observable parent?: FileId;

  componentDidMount() {
    this.parent = this.props.task.parent;
    if (this.props.task.parent) {
      this.props.store.getTask(this.props.task.parent,this.props.task.repository).then(p => {
        if (p) {
          this.parent = p.id;
        }
      }).catch(e => console.error('Could not load task', e));
    }
  }

  onChange = (parent: IdnadrevFile<{}, {}> | undefined) => {
    if (parent) {
      this.props.task.parent = parent.id;
    } else {
      this.props.task.parent = undefined;
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (

      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Parent' colon={true}>
        {getFieldDecorator('parent', {
          initialValue: this.parent
        })(
          <IdnadrevFileSelection fileType={FileType.Task} store={this.props.store} onSelect={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

@observer
export class EstimatedTimeFormItem extends React.Component<TaskFormItemProps, object> {
  estimatedTime?: Seconds;

  componentDidMount() {
    this.estimatedTime = this.props.task.details.estimatedTime;
    if (this.estimatedTime) {
      this.estimatedTime = this.estimatedTime / 60;
    }
  }

  onChange = (value: number | undefined) => {
    if (value) {
      this.props.task.details.estimatedTime = value * 60;
    } else {
      this.props.task.details.estimatedTime = undefined;
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Est. time' colon={true}>
        {getFieldDecorator('estimatedTime', {
          rules: [{
            type: 'integer', message: 'The input is no valid number',
          }, {
            type: 'integer', message: 'The remaining time must be greater then 1', min: 1,
          }], //initialValue: this.context
        })(
          <InputNumber min={1} onChange={this.onChange} style={{width: 100}}/>
        )}
      </FormItem>
    );
  }
}

@observer
export class ActionableFormItem extends React.Component<TaskFormItemProps, object> {
  actionable: boolean | undefined;

  componentDidMount() {
    this.actionable = this.props.task.isActionable();
  }

  onChange = (checked: boolean) => {
    this.props.task.details.action = checked;
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Actionable' colon={true}>
        {getFieldDecorator('actionable', {
          rules: [],
        })(
          <Switch checkedChildren={<Icon type='check'/>} unCheckedChildren={<Icon type='cross'/>}
                  defaultChecked={this.actionable} onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

function getFixedSchedule(task: Task): FixedScheduling {
  let schedule = task.details.schedule;
  if (!schedule) {
    schedule = new Scheduling();
    task.details.schedule = schedule;
  }
  let fixedScheduling = schedule.fixedScheduling;
  if (!fixedScheduling) {
    schedule.proposedDate = undefined;
    schedule.proposedWeekDayYear = undefined;
    fixedScheduling = new FixedScheduling();
    schedule.fixedScheduling = fixedScheduling;
  }
  return fixedScheduling;
}

function getProposedWeekYear(task: Task): ProposedWeekDayYear {
  let schedule = task.details.schedule;
  if (!schedule) {
    schedule = new Scheduling();
    task.details.schedule = schedule;
  }
  let proposedWeekDayYear = schedule.proposedWeekDayYear;
  if (!proposedWeekDayYear) {
    schedule.fixedScheduling = undefined;
    schedule.proposedDate = undefined;
    proposedWeekDayYear = new ProposedWeekDayYear();
    schedule.proposedWeekDayYear = proposedWeekDayYear;
  }
  return proposedWeekDayYear;
}

@observer
export class FixedDateFormItem extends React.Component<TaskFormItemProps, object> {
  date: Date | undefined;

  componentDidMount() {
    let schedule = this.props.task.details.schedule;
    if (schedule) {
      let fixedScheduling = schedule.fixedScheduling;
      if (fixedScheduling) {
        this.date = fixedScheduling.scheduledDateTime;
      }
    }
  }

  onDateChange = (date: moment.Moment) => {
    let fixedScheduling = getFixedSchedule(this.props.task);
    fixedScheduling.scheduledDateTime = date.toDate();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Date' colon={true}>
          {getFieldDecorator('fixedDate', {
            rules: [],
          })(
            <DatePicker onChange={this.onDateChange}/>
          )}
        </FormItem>
      </div>
    );
  }
}

@inject('antLocale')
@observer
export class ProposedWeekYearFormItem extends React.Component<TaskFormItemProps, object> {
  proposedYear: number | undefined;
  proposedWeek: number | undefined;
  proposedDate: Date | undefined;

  componentDidMount() {
    let schedule = this.props.task.details.schedule;
    if (schedule) {
      let proposedWeekDayYear = schedule.proposedWeekDayYear;
      if (proposedWeekDayYear) {
        this.proposedYear = proposedWeekDayYear.proposedYear;
        this.proposedWeek = proposedWeekDayYear.proposedWeek;
      }
    }
  }

  onDateChange = (date: moment.Moment) => {
    let fixedScheduling = getProposedWeekYear(this.props.task);
    fixedScheduling.proposedYear = date.year();
    fixedScheduling.proposedWeek = date.isoWeek();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Week' colon={true}>
          {getFieldDecorator('proposedWeek', {
            rules: [],
          })(
            <DatePicker onChange={this.onDateChange}/>
          )}
        </FormItem>
      </div>
    );
  }
}

@observer
export class FixedTimeFormItem extends React.Component<TaskFormItemProps, object> {
  date: Date | undefined;
  dateOnly: boolean | undefined;

  componentDidMount() {
    let schedule = this.props.task.details.schedule;
    if (schedule) {
      let fixedScheduling = schedule.fixedScheduling;
      if (fixedScheduling) {
        this.date = fixedScheduling.scheduledDateTime;
        this.dateOnly = fixedScheduling.scheduledDateOnly;
      }
    }
  }

  onTimeChange = (time: moment.Moment) => {
    if (!time) {
      getFixedSchedule(this.props.task).scheduledDateOnly = true;
    } else {
      let fixedScheduling = getFixedSchedule(this.props.task);
      let scheduledDateTime = fixedScheduling.scheduledDateTime;
      if (scheduledDateTime) {
        fixedScheduling.scheduledDateTime = moment(scheduledDateTime).hours(time.hours()).minutes(time.minutes()).toDate();
      } else {
        fixedScheduling.scheduledDateTime = moment().hours(time.hours()).minutes(time.minutes()).toDate();
      }
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Time' colon={true}>
          {getFieldDecorator('fixedTime', {
            rules: [], initialValue: this.date ? moment(this.date) : undefined
          })(
            <TimePicker format={'HH:mm'} onChange={this.onTimeChange}/>
          )}
        </FormItem>
      </div>
    );
  }
}

@observer
export class WeekOnlyFormItem extends React.Component<TaskFormItemProps, object> {
  weekOnly: boolean | undefined;

  componentDidMount() {
    let schedule = this.props.task.details.schedule;
    if (schedule && schedule.proposedWeekDayYear) {
      let proposedWeekDayYear = schedule.proposedWeekDayYear;
      this.weekOnly = !proposedWeekDayYear.proposedWeekDay;
    }
  }

  onChange = (checked: boolean) => {
    let proposedWeekYear = getProposedWeekYear(this.props.task);
    if (checked) {
      proposedWeekYear.proposedWeekDay = undefined;
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Week only' colon={true}>
        {getFieldDecorator('weekOnly', {
          rules: [],
        })(
          <Switch checkedChildren={<Icon type='check'/>} unCheckedChildren={<Icon type='cross'/>}
                  defaultChecked={this.weekOnly} onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

@observer
export class DelegatedToFormItem extends React.Component<TaskFormItemProps, object> {
  name: string | undefined;

  componentDidMount() {
    let current = this.props.task.details.delegation.current;
    if (current) {
      this.name = current.to;
    }
  }

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let delegation = this.props.task.details.delegation;
    let input = event.target.value;

    let current = delegation.current;
    if (current) {
      let start = moment(current.delegationStarted);
      let now = moment();
      let delta = now.diff(start, 'minute');
      if (delta > 2) {
        let history = new DelegationHistory(current);
        delegation.history.push(history);
        delegation.current = undefined;
      }
    } else {
      delegation.current = new Delegation();
    }

    if (input && input !== '') {
      if (delegation.current) {
        delegation.current.to = input;
      }
    } else {
      delegation.current = undefined;
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getItemProps()} label='Delegated to' colon={true}>
        {getFieldDecorator('delegationTo', {
          rules: [],
        })(
          <Input onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}