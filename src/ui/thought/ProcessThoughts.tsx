import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { observable } from 'mobx';
import Thought from '../../dto/Thought';
import UiStore from '../../store/UiStore';
import ThoughtPreview from './ThoughtPreview';
import { Layout } from 'antd';
import Pagination from 'antd/lib/pagination/Pagination';

const {Footer, Content} = Layout;

export interface ProcessThoughtsProps {
  store: GlobalStore;
  uiStore: UiStore;
}

function noop() {
  //
}

@inject('store', 'uiStore')
@observer
export default class ProcessThoughts extends React.Component<ProcessThoughtsProps, object> {
  @observable thoughts: Thought[];
  @observable previewThought?: Thought;

  componentWillMount() {
    this.props.uiStore.header = 'Process Thoughts';
  }

  componentDidMount() {
    this.reload();
    window.onkeydown = this.onKeyPress; //fixme replace with below and get that working
    // window.addEventListener('onkeydown', this.onKeyPress, true);
  }

  componentWillUnmount() {
    window.onkeydown = noop;
    // window.removeEventListener('onkeydown', this.onKeyPress);
  }

  reload = () => {
    this.props.store.getOpenThoughts().then((t: Thought[]) => {
      this.thoughts = t;
      if (this.thoughts && this.thoughts.length > 0) {
        this.previewThought = this.thoughts[0];
      } else {
        this.previewThought = undefined;
      }
    }).catch(e => {
      console.error('Could not load thoughts', e);
      console.error(e);
    });
  };

  switchThought = (page: number) => {
    if (this.thoughts.length > page - 1) {
      this.previewThought = this.thoughts[page - 1];
    }
  };

  next = () => {
    if (this.hasNext()) {
      console.log('next page ' + this.getPageNumber() + 1);
      this.switchThought(this.getPageNumber() + 1);
    }
  };

  hasNext = () => {
    return this.getPageNumber() < this.thoughts.length;
  };
  hasPrevious = () => {
    return this.getPageNumber() > 1;
  };

  previous = () => {
    if (this.hasPrevious()) {
      this.switchThought(this.getPageNumber() - 1);
    }
  };

  onKeyPress = (e: KeyboardEvent) => {
    console.log(e);
    if (e.key === 'ArrowLeft') {
      this.previous();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      this.next();
      e.preventDefault();
    }
  };

  render() {
    let thoughts = this.thoughts;
    if (thoughts === undefined) {
      thoughts = [];
    }
    let pageNumber = this.getPageNumber();

    return (
      <div>
        <Layout>
          <Content>
            <Layout>
              <Content>
                <ThoughtPreview reload={this.swap} showActions thought={this.previewThought} store={this.props.store}/>
              </Content>
            </Layout>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            <Pagination
              current={pageNumber} pageSize={1}
              total={thoughts.length} onChange={this.switchThought}/>
          </Footer>
        </Layout>
      </div>
    );
  }

  swap = () => {
    if (this.hasNext()) {
      this.next();
      this.reload();
    } else if (this.hasPrevious()) {
      this.previous();
      this.reload();
    } else {
      this.reload();
    }
  };

  private getPageNumber(): number {
    let pageNumber = 0;
    if (this.previewThought != null) {
      pageNumber = this.thoughts.indexOf(this.previewThought);
    }
    pageNumber += 1;
    return pageNumber;
  }
}
