import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import IdnadrevFile from '../../dto/IdnadrevFile';
import Table from 'antd/lib/table/Table';
import { dateCell } from '../table/DateCell';
import Column from 'antd/lib/table/Column';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import { FileType } from '../../dto/FileType';

export interface IdnadrevFileSelectionTableProps {
  fileType?: FileType;
  nameFilter?: string;
  store: GlobalStore;
}

class NameFilter extends React.Component<object, object> {
  render() {
    return <div/>;
  }
}

@observer
export class IdnadrevFileSelectionTable extends React.Component<IdnadrevFileSelectionTableProps, object> {
  @observable files: IdnadrevFile<{}, {}>[];

  componentDidMount() {
    this.props.store.getAllFiles(this.props.fileType, this.props.nameFilter)//
      .then(files => this.files = files)//
      .catch(e => console.error('Could not load files, %o', e));
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <NameFilter/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table dataSource={this.files} rowKey='id'>
              <Column dataIndex='name' title='Name'/>
              <Column dataIndex='updated' title='Updated' render={dateCell}/>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}