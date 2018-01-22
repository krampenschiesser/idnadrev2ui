import * as React from 'react';
import { Form } from 'antd';
// import {Form, Input} from "antd";
import { FormComponentProps } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import NameFormItem from '../form/NameFormItem';
import TagFormItem from '../form/TagFormItem';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import MarkdownFormItem from '../form/MarkdownFormItem';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import UiStore, { UiWidthDimension } from '../../store/UiStore';
import { FormConstants } from '../form/FormConstants';
import RepositoryFormItem from '../form/RepositoryFormItem';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import TaskPreview from './TaskPreview';
import Task from '../../dto/Task';
import { ActionableFormItem, ContextFormItem, EstimatedTimeFormItem, TaskParentFormItem, TaskStateFormItem } from './TaskFormItems';
import Tabs from 'antd/lib/tabs';

const Tab = Tabs.TabPane;

export interface AddTaskProps extends FormComponentProps {
  task?: Task;
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
class AddTaskForm extends React.Component<AddTaskProps, object> {
  @observable task: Task;

  componentWillMount() {
    if (this.props.task) {
      this.task = this.props.task;
    } else {
      this.task = new Task('');
    }
    this.props.uiStore.header = 'Add Task';
  }

  renderGeneral = () => {
    const {task, ...newProps} = this.props;
    const halfIndent = this.props.uiStore.uiWidth >= UiWidthDimension.xl ? 6 : 3;

    return (
      <div>
        <Row>
          <Col span={24}>
            <NameFormItem file={this.task} form={this.props.form}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <TagFormItem form={this.props.form} store={this.props.store} file={this.task}/>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <ContextFormItem indent={halfIndent} {...newProps} task={this.task}/>
          </Col>
          <Col xl={12}>
            <TaskStateFormItem indent={halfIndent} {...newProps} task={this.task}/>
          </Col>
          <Col xl={12}>
            <EstimatedTimeFormItem indent={halfIndent} {...newProps} task={this.task}/>
          </Col>
          <Col xl={12}>
            <ActionableFormItem indent={halfIndent} {...newProps} task={this.task}/>
          </Col>
          <Col xl={24}>
            <TaskParentFormItem indent={FormConstants.labelSpan} {...newProps} task={this.task}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <MarkdownFormItem form={this.props.form} item={this.task}/>
            <RepositoryFormItem file={this.task} store={this.props.store} form={this.props.form}/>
            <FormItem wrapperCol={{offset: FormConstants.buttonOffset}}>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <Form layout='horizontal'>
        <Row>
          <Col span={12}>
            <Tabs>
              <Tab key='general' tab='General'>
                {this.renderGeneral()}
              </Tab>
              <Tab key='scheduling' tab='Scheduling'>
                <p>Bla</p>
              </Tab>
              <Tab key='delegation' tab='Delegation'>
                <p>Bla</p>
              </Tab>
              <Tab key='workunits' tab='Work Units'>
                <p>Bla</p>
              </Tab>
            </Tabs>
          </Col>
          <Col span={12}>
            <div style={{marginLeft: 20}}>
              <TaskPreview task={this.task} store={this.props.store}/>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export const AddTask = Form.create()(AddTaskForm);
