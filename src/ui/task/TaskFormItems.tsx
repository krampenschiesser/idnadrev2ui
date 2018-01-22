import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import Task, { Seconds, TaskState } from '../../dto/Task';
import Select from 'antd/lib/select';
import { GlobalStore } from '../../store/GlobalStore';
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

const Option = Select.Option;

export interface TaskFormItemProps extends FormComponentProps {
  task: Task;
  store: GlobalStore;
  uiStore: UiStore;
  indent?: number;
}

@observer
export class ContextFormItem extends React.Component<TaskFormItemProps, object> {
  context: string | null;
  allContexts: string[];

  componentDidMount() {
    this.context = this.props.task.context;
    this.allContexts = Array.from(this.props.store.contexts.keys());
    this.allContexts.sort();
  }

  onChange = (text: string) => {
    let value = text;
    if (value) {
      this.props.task.details.context = value;
      if (value === '') {
        this.props.task.details.context = null;
      }
    } else {
      this.props.task.details.context = null;
    }
  };

  render() {
    let contexts = Array.from(this.props.store.contexts.keys());
    contexts.sort();

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getHalfItemProps(this.props.indent)} label='Context' colon={true}>
        {getFieldDecorator('context', {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }], //initialValue: this.context
        })(
          <AutoComplete dataSource={contexts} style={{width: 150}} onChange={this.onChange}/>
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
  @observable parent: FileId | null;

  componentDidMount() {
    this.parent = this.props.task.parent;
    if (this.props.task.parent) {
      this.props.store.getTask(this.props.task.parent).then(p => {
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
      this.props.task.parent = null;
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
  estimatedTime: Seconds | null;

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
      this.props.task.details.estimatedTime = null;
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
          <Switch checkedChildren={<Icon type='check'/>} unCheckedChildren={<Icon type='cross'/>} defaultChecked={this.actionable} onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}