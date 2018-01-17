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
import { Tag } from '../../dto/Tag';
import { TableRowSelection } from 'antd/es/table/interface';
import Input from 'antd/lib/input/Input';
import { tagsCell } from '../table/TagsCell';
import ClickCell from '../table/ClickCell';

export interface IdnadrevFileSelectionTableProps {
  fileType?: FileType;
  nameFilter?: string;
  tags: Tag[];
  store: GlobalStore;
}

class NameFilter extends React.Component<object, object> {
  render() {
    return <Input/>;
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
    const rowSelection: TableRowSelection<IdnadrevFile<{}, {}>> = {
      type: 'radio',
      onSelect: (record: IdnadrevFile<{}, {}>, selected: boolean, selectedRows: Object[]) => console.log('selected', record, selected, selectedRows)
    };

    let rowClick = (name: string, record: IdnadrevFile<{}, {}>, index: number) => {
      return <ClickCell onClick={() => console.log('selected ', name, record)}>{name}</ClickCell>;
    };
    return (
      <div>
        <Row>
          <Col>
            <NameFilter/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table rowSelection={rowSelection} dataSource={this.files} rowKey='id'>
              <Column dataIndex='name' title='Name' render={rowClick}/>
              <Column dataIndex='updated' title='Updated' render={dateCell}/>
              <Column dataIndex='tags' title='Tags' render={tagsCell}/>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}