import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import AutoComplete from 'antd/lib/auto-complete';
import { IdnadrevFileType } from '../../dto/IdnadrevFile';

export interface IdnadrevFileSelectionProps {
  fileType?: IdnadrevFileType;
  store: GlobalStore;
}

@observer
export class IdnadrevFileSelection extends React.Component<IdnadrevFileSelectionProps, object> {
  @observable names: string[];

  render() {
    return (
      <div>
        <AutoComplete dataSource={this.names}/>
      </div>
    );
  }
}