import { observer } from 'mobx-react';
import * as React from 'react';
import { Tag } from 'antd';
import IdnadrevFile from '../../dto/IdnadrevFile';
import GlobalStore from '../../store/GlobalStore';

export class TagViewerProps {
  item: IdnadrevFile<{}, {}>;
  store: GlobalStore;
}

@observer
export default class TagViewer extends React.Component<TagViewerProps, object> {
  render() {

    return (
      <div>
        {this.props.item.tags.map(e =>
          <Tag color={this.props.store.getTagColor(e.name)} key={e.name}>
            <span style={{fontSize: 16, fontWeight: 'bold'}}>{e.name}</span>
          </Tag>)}
      </div>
    );
  }
}