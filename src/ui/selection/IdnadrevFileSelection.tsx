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

export interface IdnadrevFileSelectionProps {
  fileType?: FileType;
  store: GlobalStore;
  onSelect: (file: IdnadrevFile<{}, {}> | undefined) => void;
}

@observer
export class IdnadrevFileSelection extends React.Component<IdnadrevFileSelectionProps, object> {
  @observable names: string[];
  @observable tableVisible: boolean = false;
  @observable selected: IdnadrevFile<{}, {}> | undefined;
  @observable name: string | undefined;

  selectFile = (file: IdnadrevFile<{}, {}> | undefined) => {
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
          <IdnadrevFileSelectionTable onSelect={this.selectFile} nameFilter={this.name} tags={[]} store={this.props.store}/>
        </Modal>
      </div>
    );
  }
}