import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { FileType } from '../../dto/FileType';
import { Input, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { IdnadrevFileSelectionTable } from './IdnadrevFileSelectionTable';

export interface IdnadrevFileSelectionProps {
  fileType?: FileType;
  store: GlobalStore;
}

@observer
export class IdnadrevFileSelection extends React.Component<IdnadrevFileSelectionProps, object> {
  @observable names: string[];
  @observable tableVisible: boolean = false;
  @observable selected: IdnadrevFile<{}, {}> | undefined;

  select = () => {
    //
    this.tableVisible = false;
  };

  toggleVisible = () => {
    this.tableVisible = !this.tableVisible;
  };

  render() {
    return (
      <div>
        <Input/>
        <Button icon='search' onClick={this.toggleVisible}/>

        <Modal title='Select parent' visible={this.tableVisible} onOk={this.select}
               onCancel={() => this.tableVisible = false}>
          <IdnadrevFileSelectionTable tags={[]} store={this.props.store}/>
        </Modal>
        {/*<AutoComplete dataSource={this.names}/>*/}
      </div>
    );
  }
}