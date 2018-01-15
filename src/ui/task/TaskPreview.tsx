import * as React from 'react';
import { observer } from 'mobx-react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import { GlobalStore } from '../../store/GlobalStore';
import TagViewer from '../tag/TagViewer';
import { MarkdownViewer } from '../editor/MarkdownViewer';
import Card from 'antd/lib/card';
import Task from '../../dto/Task';

export interface TaskPreviewProps {
  task: Task | null;
  store: GlobalStore;
  // showActions?: boolean;
}

@observer
export default class TaskPreview extends React.Component<TaskPreviewProps, object> {
  render() {
    const task = this.props.task;
    // const showActions = this.props.showActions === undefined ? false : this.props.showActions;

    if (task !== null) {
      let title = (
        <div>
          <Row>
            <Col span={12}>
              <h2>{task.name}</h2>
            </Col>
            <Col style={{marginTop: 10, textAlign: 'right'}} span={12}>
              <span>{task.updated.toLocaleDateString() + '   ' + task.updated.toLocaleTimeString()}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <TagViewer store={this.props.store} item={task}/>
            </Col>
          </Row>
        </div>
      );
      return (
        <Card title={title}>
          <MarkdownViewer text={task.content}/>
        </Card>
      );
    } else {
      return <div/>;
    }
  }
}
