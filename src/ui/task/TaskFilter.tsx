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

export interface TaskFilterProps extends FormComponentProps {
  filter: TaskFilter;
  reload: Function;
  store: GlobalStore;
}

class NameFilter extends React.Component<TaskFilterProps, object> {
  onChange = (text: React.ChangeEvent<HTMLInputElement>) => {
    let value = text.target.value;
    if (value) {
      this.props.filter.name = value;
    } else {
      this.props.filter.name = undefined;
    }
    this.props.reload();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Name' colon={true}>
        {getFieldDecorator('name', {
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

  // onChange = (value: any) => {
  //     console.log(value);
  //     if (value) {
  //         this.props.filter.state = value;
  //     } else {
  //         this.props.filter.state = undefined;
  //     }
  //     this.props.reload();//fixme reload after timeout after last modification
  // };

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

@observer
class TaskFilterViewForm extends React.Component<TaskFilterProps, object> {
  lastEdit: number;

  reload = () => {
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
    const {reload: Function, ...newProps} = this.props;
    return (
      <Form layout='inline'>
        <NameFilter {...newProps} reload={this.reload}/>
        <ContextFilter {...newProps} reload={this.reload}/>
        <TaskStateFilter {...newProps} reload={this.reload}/>
        <TagFilter {...newProps} reload={this.reload}/>
      </Form>
    );
  }
}

export const TaskFilterView = Form.create()(TaskFilterViewForm);
