import * as React from 'react';
import { Tag, Icon, AutoComplete } from 'antd';
import { observable } from 'mobx';
import GlobalStore from '../../store/GlobalStore';
import { observer } from 'mobx-react';

export interface AddTagProps {
  onAdd: (tag: string) => void;
  store: GlobalStore;
}

@observer
export class AddTag extends React.Component<AddTagProps, object> {
  @observable edit: boolean;
  @observable tags: string[] = [];

  autoComplete = (input: string) => {
    const tags = this.props.store.getTagsStartingWith(input);
    this.tags = tags;
  };

  toggle = () => {
    console.log('here');
    this.edit = !this.edit;
  };

  onChange = (data: string) => {
    console.log(data);
  };

  render() {
    if (this.edit) {
      return <AutoComplete
        dataSource={this.tags}
        style={{width: 200}}
        onSearch={this.autoComplete}
        onSelect={(value: string) => this.props.onAdd(value)}
        placeholder="New Tag"
        onChange={this.onChange}
      />;
    } else {
      return (
        <span onClick={this.toggle}><Tag><Icon type="plus"/> New Tag</Tag></span>
      );
    }
  }
}