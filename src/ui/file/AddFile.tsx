import * as React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import NameFormItem from '../form/NameFormItem';
import TagFormItem from '../form/TagFormItem';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import MarkdownFormItem from '../form/MarkdownFormItem';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import UiStore from '../../store/UiStore';
import { FormConstants } from '../form/FormConstants';
import RepositoryFormItem from '../form/RepositoryFormItem';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import DocumentPreview from './DocumentPreview';
import IdnadrevFile from '../../dto/IdnadrevFile';
import Document from '../../dto/Document';
import BinaryFile from '../../dto/BinaryFile';

export interface AddFileProps extends FormComponentProps {
  file?: BinaryFile;
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
class AddFileForm extends React.Component<AddFileProps, object> {
  @observable file: BinaryFile;

  componentWillMount() {
    if (this.props.file) {
      this.file = this.props.file;
    } else {
      this.file = new Document('');
    }
    this.props.uiStore.header = 'Add File';
  }

  render() {
    let editor = undefined;
    if (this.file.isTextFile()) {
      // tslint:disable-next-line
      let a: any = this.file;
      let cast: IdnadrevFile<{}, string> = a;
      editor = <MarkdownFormItem form={this.props.form} item={cast}/>;
    } else {
      editor = <div/>;
    }
    return (
      <Row>
        <Col span={12}>
          <Form layout='horizontal'>
            <NameFormItem file={this.file} form={this.props.form}/>
            <TagFormItem form={this.props.form} store={this.props.store} file={this.file}/>
            {editor}
            <RepositoryFormItem file={this.file} store={this.props.store} form={this.props.form}/>
            <FormItem wrapperCol={{offset: FormConstants.buttonOffset}}>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={12}>
          <div style={{marginLeft: 20}}>
            <DocumentPreview file={this.file} store={this.props.store}/>
          </div>
        </Col>
      </Row>
    );
  }
}

export const AddFile= Form.create()(AddFileForm);
