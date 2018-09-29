import * as React from 'react';
import { Form, Upload, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import NameFormItem from '../form/NameFormItem';
import TagFormItem from '../form/TagFormItem';
import GlobalStore from '../../store/GlobalStore';
import { observable } from 'mobx';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import UiStore from '../../store/UiStore';
import { FormConstants } from '../form/FormConstants';
import RepositoryFormItem from '../form/RepositoryFormItem';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import DocumentPreview from '../document/DocumentPreview';
import BinaryFile from '../../dto/BinaryFile';
import { UploadFile } from 'antd/lib/upload/interface';
import { lookup } from 'mime-types';

const Dragger = Upload.Dragger;

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
      this.file = new BinaryFile('');
    }
    this.props.uiStore.header = 'Add File';
  }

  beforeUpload = (file: UploadFile, fileList: UploadFile[]): boolean => {
    console.log(file);
    console.log(file.name);
    let mimeType = lookup(file.name);
    console.log('mimetype: ', mimeType);
    console.log(file.originFileObj);
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log('loaded successfully');
      console.log(reader.result);
    };
    reader.onprogress = (ev) => {
      console.log(ev.total / ev.loaded);
    };
    if (reader.result instanceof ArrayBuffer && file.originFileObj) {
      reader.readAsArrayBuffer(file.originFileObj);
      this.file.content = new Uint8Array(reader.result);
      this.file.details.mimeType = mimeType ? mimeType : undefined;
      this.file.details.originalFileName = file.fileName;
      console.log(reader.result);
      return true;
    }
    return false;
  };

  render() {
    let editor = (
      <Dragger beforeUpload={this.beforeUpload}>
        <p className='ant-upload-drag-icon'>
          <Icon type='inbox'/>
          <span className='ant-upload-text'>Click or drag file to this area to upload</span>
          <span className='ant-upload-hint'>Support for a single or bulk upload.</span>
        </p>
      </Dragger>
    );
    return (
      <Row>
        <Col span={12}>
          <Form layout='horizontal' onSubmit={this.onSubmit}>
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
  onSubmit = () => {
    let repository = this.props.store.getRepository(this.file.repository);
    if (repository) {
      this.props.store.webStorage.storeBinaryFile(this.file, repository);
    }
  };
}

export const AddFile = Form.create()(AddFileForm);
