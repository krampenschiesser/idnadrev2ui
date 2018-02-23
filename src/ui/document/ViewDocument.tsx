import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import UiStore from '../../store/UiStore';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import { dateCell } from '../table/DateCell';
import HoverCell from '../table/HoverCell';
import IdnadrevFile from '../../dto/IdnadrevFile';
import DocumentPreview from './DocumentPreview';
import FileFilter from '../../store/FileFilter';

export interface ViewDocumentProps {
  store: GlobalStore;
  uiStore: UiStore;
}

@inject('store', 'uiStore')
@observer
export default class ViewDocument extends React.Component<ViewDocumentProps, object> {
  @observable files: IdnadrevFile<object, object>[];
  @observable previewFile: IdnadrevFile<object, object> | undefined = undefined;

  filter: FileFilter = {};

  componentWillMount() {
    this.props.uiStore.header = 'View Documents';
  }

  componentDidMount() {
    this.props.store.getAllFiles().then((t: IdnadrevFile<{}, {}>[]) => {
      this.files = t;
    }).catch(e => {
      console.error('Could not load files', e);
      console.error(e);
    });

  }

  showMarkdownPreview = (file: IdnadrevFile<{}, {}>) => {
    this.previewFile = file;
  };

  render() {
    let files = this.files;
    if (files === undefined) {
      files = [];
    }

    let markdownHover = (name: string, record: IdnadrevFile<{}, {}>, index: number) => {
      return <HoverCell onHover={() => this.showMarkdownPreview(record)}>{name}</HoverCell>;
    };

    return (
      <Row>
        <Col span={12}>
          <Table rowKey='id' dataSource={files}>
            <Column dataIndex='created' title='Created' render={dateCell}/>
            <Column dataIndex='name' title='Name' render={markdownHover}/>
            <Column dataIndex='repositoryId' title='Repository'/>
          </Table>
        </Col>
        <Col span={12}>
          <div style={{marginLeft: 20}}>
            <DocumentPreview file={this.previewFile} store={this.props.store}/>
          </div>
        </Col>
      </Row>
    );
  }
}
