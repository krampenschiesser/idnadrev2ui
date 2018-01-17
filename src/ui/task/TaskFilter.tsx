import * as React from 'react';
import { observer } from 'mobx-react';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import { FormComponentProps } from 'antd/lib/form';
import { TaskFilter } from '../../store/TaskFilter';
import { GlobalStore } from '../../store/GlobalStore';

const Option = Select.Option;
import Select from 'antd/lib/select';
import { TaskState } from '../../dto/Task';
import TagContainer from '../tag/TagContainer';
import { observable, observe } from 'mobx';
import { Tag } from '../../dto/Tag';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import InputNumber from 'antd/lib/input-number';
import { ChangeEvent } from 'react';

export interface TaskFilterProps extends FormComponentProps {
  filter: TaskFilter;
  reload: Function;
  store: GlobalStore;
}

class StringFilter extends React.Component<TaskFilterProps, object> {
  private label: string;
  private callback: (param: string | undefined) => void;

  constructor(props: TaskFilterProps, callback: (param: string | undefined) => void, label: string) {
    super(props);
    this.label = label;
    this.callback = callback;
  }

  onChange = (text: React.ChangeEvent<HTMLInputElement>) => {
    let value = text.target.value;
    if (value) {
      this.callback(value);
    } else {
      this.callback(undefined);
    }
    this.props.reload();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label={this.label} colon={true}>
        {getFieldDecorator(this.label, {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }],
        })(
          <Input onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

class NameFilter extends StringFilter {
  constructor(props: TaskFilterProps) {
    super(props, (str) => {
      this.props.filter.name = str;
    }, 'Name');
  }
}

class DelegatedToFilter extends StringFilter {
  constructor(props: TaskFilterProps) {
    super(props, (str) => {
      this.props.filter.delegatedTo = str;
    }, 'Delegated to');
  }
}

class ContextFilter extends React.Component<TaskFilterProps, object> {
  onChange = (value: string) => {
    if (value) {
      if (value === '') {
        this.props.filter.context = undefined;
      } else {
        this.props.filter.context = value;
      }
    } else {
      this.props.filter.context = undefined;
    }
    this.props.reload();
  };

  render() {

    let contexts = Array.from(this.props.store.contexts.keys());
    contexts.sort();

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Context' colon={true}>
        {getFieldDecorator('context', {})(
          <Select style={{width: 120}} onChange={this.onChange}>
            <Option key='none' value={undefined}>None</Option>
            {contexts.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        )}
      </FormItem>
    );
  }
}

class TaskStateFilter extends React.Component<TaskFilterProps, object> {
  // tslint:disable-next-line
  onChange = (value: any) => {
    console.log(value);
    if (value) {
      this.props.filter.state = value;
    } else {
      this.props.filter.state = undefined;
    }
    this.props.reload();
  };

  render() {
    let taskStates = [TaskState.None, TaskState.Asap, TaskState.Delegated, TaskState.Later];

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='State' colon={true}>
        {getFieldDecorator('state', {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }],
        })(
          <Select style={{width: 120}} onChange={this.onChange}>
            {taskStates.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        )}
      </FormItem>
    );
  }
}

class TagFilter extends React.Component<TaskFilterProps, object> {
  @observable tags: Tag[] = [];

  observer = observe(this.tags, (change => {
    let newValue = change.object;
    if (newValue) {
      this.props.filter.tags = newValue;
    } else {
      this.props.filter.tags = [];
    }
    this.props.reload();
  }));

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Tags' colon={true}>
        {getFieldDecorator('tags', {})(
          <TagContainer store={this.props.store} item={this.tags}/>
        )}
      </FormItem>
    );
  }
}

class BooleanFilter extends React.Component<TaskFilterProps, object> {
  private callback: (enabled: boolean) => void;
  private label: string;

  constructor(props: TaskFilterProps, callback: (enabled: boolean) => void, label: string) {
    super(props);
    this.callback = callback;
    this.label = label;

  }

// tslint:disable-next-line
  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.checked;
    console.log(value);
    this.callback(value);
    this.props.reload();
  };

  render() {

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label={this.label} colon={true}>
        {getFieldDecorator(this.label, {
          rules: [],
        })(
          <Checkbox onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

class FinishFilter extends BooleanFilter {
  constructor(props: TaskFilterProps) {
    super(props, (val) => {
      this.props.filter.finished = val;
    }, 'Finished');
  }
}

class DelegatedFilter extends BooleanFilter {
  constructor(props: TaskFilterProps) {
    super(props, (val) => {
      this.props.filter.delegated = val;
    }, 'Delegated');
  }
}

class ScheduledFilter extends BooleanFilter {
  constructor(props: TaskFilterProps) {
    super(props, (val) => {
      this.props.filter.scheduled = val;
    }, 'Scheduled');
  }
}

class ProposedFilter extends BooleanFilter {
  constructor(props: TaskFilterProps) {
    super(props, (val) => {
      this.props.filter.proposed = val;
    }, 'Proposed');
  }
}

class RemainingTimeFilter extends React.Component<TaskFilterProps, object> {
  onChange = (value: number) => {
    if (value) {
      if (value <= 0) {
        this.props.filter.remainingTimeLessThen = undefined;
      } else {
        this.props.filter.remainingTimeLessThen = value;
      }
    } else {
      this.props.filter.remainingTimeLessThen = undefined;
    }
    this.props.reload();
  };

  render() {

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Remaining time' colon={true}>
        {getFieldDecorator('remainingTime', {
          rules: [{
            type: 'integer', message: 'The input is no valid number',
          }, {
            type: 'integer', message: 'The remaining time must be greater then 1', min: 1,
          }],
        })(
          <InputNumber onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}

//todo: parent selection filter

@observer
class TaskFilterViewForm extends React.Component<TaskFilterProps, object> {
  lastEdit: number;

  reload = () => {
    console.log(this.props.filter);
    const timeout = 80;
    this.lastEdit = new Date().getTime();

    let callback = () => {
      let now = new Date().getTime();
      if (now - this.lastEdit >= timeout) {
        this.props.reload();
      }
    };
    setTimeout(callback, timeout);
  };

  render() {
    const {reload, ...newProps} = this.props;
    return (
      <Form layout='inline'>
        <NameFilter {...newProps} reload={this.reload}/>
        <ContextFilter {...newProps} reload={this.reload}/>
        <TaskStateFilter {...newProps} reload={this.reload}/>
        <TagFilter {...newProps} reload={this.reload}/>
        <FinishFilter {...newProps} reload={this.reload}/>
        <DelegatedFilter {...newProps} reload={this.reload}/>
        <ScheduledFilter {...newProps} reload={this.reload}/>
        <ProposedFilter {...newProps} reload={this.reload}/>
        <DelegatedToFilter {...newProps} reload={this.reload}/>
        <RemainingTimeFilter {...newProps} reload={this.reload}/>
      </Form>
    );
  }
}

export const TaskFilterView = Form.create()(TaskFilterViewForm);
