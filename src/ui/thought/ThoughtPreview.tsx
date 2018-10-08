import * as React from 'react';
import { observer } from 'mobx-react';
import Thought from '../../dto/Thought';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import GlobalStore from '../../store/GlobalStore';
import TagViewer from '../tag/TagViewer';
import { MarkdownViewer } from '../editor/MarkdownViewer';
import Card from 'antd/lib/card';
import { DeleteThought, PostponeThought, ThoughtToDocument, ThoughtToTask } from './ThoughtActions';
import { RouteComponentProps } from 'react-router';

export interface ThoughtPreviewProps extends RouteComponentProps<any>{
  thought?: Thought ;
  store: GlobalStore;
  showActions?: boolean;
  reload?: () => void;
}

@observer
export default class ThoughtPreview extends React.Component<ThoughtPreviewProps, object> {
  render() {
    const thought = this.props.thought;
    const showActions = this.props.showActions === undefined ? false : this.props.showActions;
    const reload = this.props.reload ? this.props.reload : ()=>{};
    // const routeProps = {
    //   history: this.props.history,
    //   match: this.props.match,
    //   location: this.props.location,
    // }

    if (thought) {
      let actions: React.ReactNode[] = [];
      if (showActions) {
        actions = [
          <ThoughtToTask {...this.props} reload={reload} key='toTask' store={this.props.store} thought={thought}/>,
          <ThoughtToDocument {...this.props} reload={reload} key='toDoc' store={this.props.store} thought={thought}/>,
          <PostponeThought {...this.props} reload={reload} key='postpone' store={this.props.store} thought={thought}/>,
          <DeleteThought {...this.props} reload={reload} key='delete' store={this.props.store} thought={thought}/>,
        ];
      }
      let title = (
        <div>
          <Row>
            <Col span={12}>
              <h2>{thought.name}</h2>
            </Col>
            <Col style={{marginTop: 10, textAlign: 'right'}} span={12}>
              <span>{thought.updated.toLocaleDateString() + '   ' + thought.updated.toLocaleTimeString()}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <TagViewer store={this.props.store} item={thought}/>
            </Col>
          </Row>
        </div>
      );
      return (
        <Card actions={actions} title={title}>
          <MarkdownViewer text={thought.content}/>
        </Card>
      );
    } else {
      return <div/>;
    }
  }
}
