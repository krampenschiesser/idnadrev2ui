import * as React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import GlobalStore from '../store/GlobalStore';
import IdnadrevFile from '../dto/IdnadrevFile';
import { RepositoryId } from '../dto/RepositoryId';

const {Option} = Select;

export interface RepositorySelectorProps {
  store: GlobalStore;
  file: IdnadrevFile<{}, {}>;
}

@observer
export default class RepositorySelector extends React.Component<RepositorySelectorProps, object> {

  onChange = (value: RepositoryId) => {
    this.props.file.repository = value;
    this.props.store.lastSelectedRepository = value;
  };

  render() {

    let openRepositories = this.props.store.getOpenRepositories();
    let options = openRepositories.map(r => {
      return (<Option key={r.id} value={r.id}>{r.name}</Option>);
    });
    let lastSelectedRepository = this.props.store.lastSelectedRepository;
    if (lastSelectedRepository === null && openRepositories.length > 0) {
      lastSelectedRepository = openRepositories[0].id;
    }
    return (
      <Select disabled={openRepositories.length === 0} onChange={this.onChange} defaultValue={lastSelectedRepository === null ? '' : lastSelectedRepository}>
        {options}
      </Select>
    );
  }
}