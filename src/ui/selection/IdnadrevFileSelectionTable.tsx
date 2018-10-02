import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
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
import { PaginationProps } from 'antd/lib/pagination/Pagination';

class FileTable extends Table<IdnadrevFile<{}, {}>> {
}

class FileColumn extends Column<IdnadrevFile<{}, {}>> {
}

export interface IdnadrevFileSelectionTableProps<T extends IdnadrevFile<{},{}>> {
  fileType?: FileType;
  nameFilter?: string;
  tags: Tag[];
  store: GlobalStore;
  onSelect: (file: T) => void;
  filter?: (file: T, files: T[]) => boolean;
}

interface NameFilterProps {
  value?: string;
  callback: (value: string) => void;
}

class NameFilter extends React.Component<NameFilterProps, object> {
  render() {
    return <Input onChange={(e) => this.props.callback(e.target.value)} defaultValue={this.props.value}/>;
  }
}

@observer
export class IdnadrevFileSelectionTable<T extends IdnadrevFile<{},{}>> extends React.Component<IdnadrevFileSelectionTableProps<T>, object> {
  @observable files: T[] = [];
  @observable selectedFile: T | undefined;
  @observable nameFilter: string | undefined;

  constructor(props: IdnadrevFileSelectionTableProps<T>) {
    super(props);
    this.nameFilter = props.nameFilter;
  }

  componentDidMount() {
    this.props.store.getAllFiles({
      types: this.props.fileType ? [this.props.fileType] : undefined,
      name: this.nameFilter
    }).then(files => {
      // @ts-ignore
      this.files = files;
    })//
      .catch(e => console.error('Could not load files, %o', e));
  }

  render() {
    let data = this.files;

    let currentRows = this.selectedFile === undefined ? [] : [this.selectedFile.id];

    const rowSelection: TableRowSelection<T> = {
      type: 'radio',
      selectedRowKeys: currentRows,
      onSelect: (record: T, selected: boolean, selectedRows: Object[]) => {
        if (selected) {
          this.selectedFile = record;
          this.props.onSelect(record);
        } else {
          this.selectedFile = undefined;
        }
      }
    };

    const rowClick = (name: string, record: T, index: number) => {
      return (
        <ClickCell
          onClick={() => {
            this.selectedFile = record;
            this.props.onSelect(record);
          }}>{name}</ClickCell>
      );
    };

    const pagination: PaginationProps = {pageSize: 5};

    if (this.nameFilter) {
      const needle = this.nameFilter.toLowerCase();
      data = data.filter(f => f.name.toLowerCase().indexOf(needle) > 0);
    }
    if (this.props.filter) {
      let filter = this.props.filter;
      data = data.filter(f => filter(f, data));
    }

    return (
      <div>
        <Row>
          <Col>
            <NameFilter value={this.nameFilter} callback={(v) => this.nameFilter = v}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <FileTable pagination={pagination} rowSelection={rowSelection} dataSource={data} rowKey='id'>
              <FileColumn dataIndex='name' title='Name' render={rowClick}/>
              <FileColumn dataIndex='updated' title='Updated' render={dateCell}/>
              <FileColumn dataIndex='tags' title='Tags' render={tagsCell}/>
            </FileTable>
          </Col>
        </Row>
      </div>
    );
  }
}