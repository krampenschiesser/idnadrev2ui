import * as React from 'react';
import { observer } from 'mobx-react';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import { FormComponentProps } from 'antd/lib/form';
import { GlobalStore } from '../../store/GlobalStore';

import TagContainer from '../tag/TagContainer';
import { observable, observe } from 'mobx';
import { Tag } from '../../dto/Tag';
import FileFilter from '../../store/FileFilter';

export interface DocumentFilterProps extends FormComponentProps {
  filter: FileFilter;
  reload: Function;
  store: GlobalStore;
}

class StringFilter extends React.Component<DocumentFilterProps, object> {
  private label: string;
  private callback: (param: string | undefined) => void;

  constructor(props: DocumentFilterProps, callback: (param: string | undefined) => void, label: string) {
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
  constructor(props: DocumentFilterProps) {
    super(props, (str) => {
      this.props.filter.name = str;
    }, 'Name');
  }
}

class ContentFilter extends StringFilter {
  constructor(props: DocumentFilterProps) {
    super(props, (str) => {
      this.props.filter.content = str;
    }, 'Content');
  }
}

class TagFilter extends React.Component<DocumentFilterProps, object> {
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

@observer
class DocumentFilterViewForm extends React.Component<DocumentFilterProps, object> {
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
        <ContentFilter {...newProps} reload={this.reload}/>
        <TagFilter {...newProps} reload={this.reload}/>
      </Form>
    );
  }
}

export const DocumentFilterView = Form.create()(DocumentFilterViewForm);
