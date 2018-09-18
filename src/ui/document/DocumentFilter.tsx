import * as React from 'react';
import { observer } from 'mobx-react';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import { FormComponentProps } from 'antd/lib/form';
import GlobalStore from '../../store/GlobalStore';

import TagContainer from '../tag/TagContainer';
import { observable, observe } from 'mobx';
import { Tag } from '../../dto/Tag';
import FileFilter from '../../store/FileFilter';
import Select from 'antd/lib/select';
import { FileType } from '../../dto/FileType';

const Option = Select.Option;

export interface FileFilterProps extends FormComponentProps {
  filter: FileFilter;
  reload: () => void;
  store: GlobalStore;
}

class StringFilter extends React.Component<FileFilterProps, object> {
  private label: string;
  private callback: (param: string | undefined) => void;

  constructor(props: FileFilterProps, callback: (param: string | undefined) => void, label: string) {
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
  constructor(props: FileFilterProps) {
    super(props, (str) => {
      this.props.filter.name = str;
    }, 'Name');
  }
}

class ContentFilter extends StringFilter {
  constructor(props: FileFilterProps) {
    super(props, (str) => {
      this.props.filter.content = str;
    }, 'Content');
  }
}

class TagFilter extends React.Component<FileFilterProps, object> {
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

class RepositoryFilter extends React.Component<FileFilterProps, object> {
  onChange = (value: string) => {
    if (value) {
      if (value === '') {
        this.props.filter.repository = undefined;
      } else {
        this.props.filter.repository = value;
      }
    } else {
      this.props.filter.repository = undefined;
    }
    this.props.reload();
  };

  render() {
    let repositoryIds = Array.from(this.props.store.getOpenRepositories().map(r => r.id));
    repositoryIds.sort();

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Repository' colon={true}>
        {getFieldDecorator('repository', {})(
          <Select style={{width: 120}} onChange={this.onChange}>
            <Option key='all' value={undefined}>All</Option>
            {repositoryIds.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        )}
      </FormItem>
    );
  }
}

class FileTypeFilter extends React.Component<FileFilterProps, object> {
  onChange = (value: FileType[]) => {
    if (value) {
      if (value.length === 0) {
        this.props.filter.types = undefined;
      } else {
        console.log('value is', value)
        this.props.filter.types = value;
      }
    } else {
      this.props.filter.repository = undefined;
    }
    this.props.reload();
  };

  render() {
    let types = [FileType.Document, FileType.Task, FileType.Thought, FileType.Binary];

    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem label='Type' colon={true}>
        {getFieldDecorator('fileType', {})(
          <Select mode='multiple' style={{width: 120}} onChange={this.onChange}>
            {types.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        )}
      </FormItem>
    );
  }
}

@observer
class DocumentFilterViewForm extends React.Component<FileFilterProps, object> {
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
    let bla = <RepositoryFilter {...newProps} reload={this.reload}/>;
    let blubb = <FileTypeFilter {...newProps} reload={this.reload}/>;
    console.log(bla, blubb);

    return (
      <Form layout='inline'>
        <NameFilter {...newProps} reload={this.reload}/>
        <ContentFilter {...newProps} reload={this.reload}/>
        <TagFilter {...newProps} reload={this.reload}/>
        <RepositoryFilter {...newProps} reload={this.reload}/>
        <FileTypeFilter {...newProps} reload={this.reload}/>
      </Form>
    );
  }
}

export const DocumentFilterView = Form.create()(DocumentFilterViewForm);
