import * as React from 'react';
import { Form } from 'antd';
// import {Form, Input} from "antd";
import { FormComponentProps } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import NameFormItem from '../form/NameFormItem';
import TagFormItem from '../form/TagFormItem';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import Thought from '../../dto/Thought';
import MarkdownFormItem from '../form/MarkdownFormItem';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import UiStore from '../../store/UiStore';
import { FormConstants } from '../form/FormConstants';
import RepositoryFormItem from '../form/RepositoryFormItem';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import ThoughtPreview from './ThoughtPreview';

// const FormItem = Form.Item;

export interface AddThoughtProps extends FormComponentProps {
  children: {};
  thought?: Thought;
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
class AddThoughtForm extends React.Component<AddThoughtProps, object> {
  @observable thought: Thought;

  componentWillMount() {
    if (this.props.thought) {
      this.thought = this.props.thought;
    }
    this.thought = new Thought('');
    this.props.uiStore.header = 'Add thought';
  }

  render() {
    return (
      <Row>
        <Col span={12}>
          <Form layout='horizontal'>
            <NameFormItem file={this.thought} form={this.props.form}/>
            <TagFormItem form={this.props.form} store={this.props.store} file={this.thought}/>
            <MarkdownFormItem form={this.props.form} item={this.thought}/>
            <RepositoryFormItem file={this.thought} store={this.props.store} form={this.props.form}/>
            <FormItem wrapperCol={{offset: FormConstants.buttonOffset}}>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={12}>
          <div style={{marginLeft: 20}}>
            <ThoughtPreview thought={this.thought} store={this.props.store}/>
          </div>
        </Col>
      </Row>
    );
  }
}

export const AddThought = Form.create()(AddThoughtForm);
