import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import UiStore from '../../store/UiStore';
import Repository from '../../dto/Repository';
import { observable } from 'mobx';
import { Button, Col, Row } from 'antd';
import './Repository.css';


export interface ViewRepositoriesProps {
  store: GlobalStore;
  uiStore: UiStore;
}

interface SingleRepositoryProps {
  repository: Repository;
  onUnlock?: (repo: Repository) => void;
  onLock?: (repo: Repository) => void;
}

class SingleRepository extends React.Component<SingleRepositoryProps, object> {
  render() {
    return (
      <div className="SingleRepository">
        <Row>
          <Col md={11} lg={16}>
            <span className="RepositoryTitle">{this.props.repository.name}</span>
          </Col>
          <Col md={12} lg={8}>
            {this.props.repository.isLocked() ?
              <Button onClick={() => this.props.onUnlock && this.props.onUnlock(this.props.repository)} icon="unlock">Unlock</Button> :
              <Button onClick={() => this.props.onLock && this.props.onLock(this.props.repository)} icon="lock">Lock</Button>
            }
          </Col>
        </Row>
      </div>
    );
  }
}

@inject('store', 'uiStore')
@observer
export default class ViewRepositories extends React.Component<ViewRepositoriesProps, object> {
  @observable
  repositories: Repository[] = [];

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
    return (
      <div>
        <Row gutter={20}>
          {this.repositories.map(r => {
            return (
              <Col key={r.id} sm={24} md={12} lg={8}>
                <SingleRepository repository={r}/>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
