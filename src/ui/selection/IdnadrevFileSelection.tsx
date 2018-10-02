import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { FileType } from '../../dto/FileType';
import { Input, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { IdnadrevFileSelectionTable } from './IdnadrevFileSelectionTable';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';

export interface IdnadrevFileSelectionProps<T extends IdnadrevFile<any,any>>  {
  fileType?: FileType;
  store: GlobalStore;
  onSelect: (file: T | undefined) => void;
  filter?: (file: T, files: T[]) => boolean;
}

@observer
export class IdnadrevFileSelection<T extends IdnadrevFile<any,any>> extends React.Component<IdnadrevFileSelectionProps<T>, object> {
  @observable names: string[];
  @observable tableVisible: boolean = false;
  @observable selected: IdnadrevFile<{}, {}> | undefined;
  @observable name: string | undefined;

  selectFile = (file: T | undefined) => {
    if (file) {
      this.selected = file;
      this.name = file.name;
      this.props.onSelect(file);
    } else {
      this.selected = undefined;
      this.name = undefined;
      this.props.onSelect(undefined);
    }
  };

  toggleVisible = () => {
    this.tableVisible = !this.tableVisible;
  };

  render() {
    return (
      <div>
        <Row>
          <Col>
            <Input
              value={this.name} style={{width: 250}} onChange={(v) => {
              this.name = v.target.value;
              if (!this.name || this.name === '') {
                this.selectFile(undefined);
              }
            }}/>
            <Button icon='search' onClick={this.toggleVisible}/>
          </Col>
        </Row>

        <Modal
          title='Select parent' visible={this.tableVisible} onOk={() => this.tableVisible = false}
          onCancel={() => this.tableVisible = false}>
          <IdnadrevFileSelectionTable<T> onSelect={this.selectFile} nameFilter={this.name} fileType={this.props.fileType}  filter={this.props.filter} tags={[]} store={this.props.store}/>
        </Modal>
      </div>
    );
  }
}