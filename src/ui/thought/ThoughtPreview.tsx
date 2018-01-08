import * as React from 'react';
import {observer} from 'mobx-react';
import Thought from '../../dto/Thought';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import {GlobalStore} from '../../store/GlobalStore';
import TagViewer from '../tag/TagViewer';
import {MarkdownViewer} from '../editor/MarkdownViewer';


export interface ThoughtPreviewProps {
    thought: Thought | null
    store: GlobalStore
}

@observer
export default class ThoughtPreview extends React.Component<ThoughtPreviewProps, object> {
    render() {

        const thought = this.props.thought;
        if (thought) {
            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <h1>{thought.name}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <TagViewer store={this.props.store} item={thought}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <MarkdownViewer text={thought.content}/>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return <div />
        }
    }
}
