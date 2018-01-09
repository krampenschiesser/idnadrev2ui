import * as React from 'react';
import {observer} from 'mobx-react';
import Thought from '../../dto/Thought';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import {GlobalStore} from '../../store/GlobalStore';
import TagViewer from '../tag/TagViewer';
import {MarkdownViewer} from '../editor/MarkdownViewer';
import Card from 'antd/lib/card';


export interface ThoughtPreviewProps {
    thought: Thought | null
    store: GlobalStore
}

@observer
export default class ThoughtPreview extends React.Component<ThoughtPreviewProps, object> {
    render() {
        const thought = this.props.thought;

        if (thought) {
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
                <Card title={title}>
                    <MarkdownViewer text={thought.content}/>
                </Card>
            );
        } else {
            return <div/>;
        }
    }
}
