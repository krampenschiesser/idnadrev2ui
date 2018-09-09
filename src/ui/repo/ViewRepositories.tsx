import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import UiStore from '../../store/UiStore';
import Repository from '../../dto/Repository';
import { observable } from 'mobx';
import { Card, Icon } from 'antd';

export interface ViewRepositoriesProps {
  store: GlobalStore;
  uiStore: UiStore;
}


class SingleRepository extends React.Component<{name: string}, object> {
  render() {
    return (
      <Card title={this.props.name} >
        <Icon type="lock" theme="outlined" />
      </Card>
    );
  }
}

@inject('store', 'uiStore')
@observer
export default class ViewRepositories extends React.Component<ViewRepositoriesProps, object> {
  @observable
  repositories: Repository[];

  componentWillMount() {
    this.props.uiStore.header = 'View Repositories';
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.props.store.getRepositories().then((t: Repository[]) => {
      this.repositories = [];
      this.repositories = t;
    }).catch(e => {
      console.error('Could not load repositories', e);
      console.error(e);
    });
  };

  render() {
    return <SingleRepository name="testRepo"/>;
  }
}
