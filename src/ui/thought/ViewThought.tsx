import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import Thought from '../../dto/Thought';
import UiStore from '../../store/UiStore';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import ThoughtPreview from './ThoughtPreview';
import {dateCell} from '../table/DateCell';
import HoverCell from '../table/HoverCell';
import {DeleteThought, PostponeThought, ThoughtToDocument, ThoughtToTask} from './ThoughtActions';


export interface ViewThoughtProps {
    store: GlobalStore
    uiStore: UiStore
}

@inject('store', 'uiStore')
@observer
export default class ViewThoughts extends React.Component<ViewThoughtProps, object> {
    @observable thoughts: Thought[];
    @observable previewThought: Thought | null = null;

    componentWillMount() {
        this.props.uiStore.header = 'View Thoughts';
    }

    componentDidMount() {
        this.props.store.getOpenThoughts().then((t: Thought[]) => {
            this.thoughts = t;
        }).catch(e => {
            console.error('Could not load thoughts', e);
            console.error(e);
        });

    }

    showMarkdownPreview = (thought: Thought) => {
        this.previewThought = thought;
    };
    toTask = () => {

    };
    toDocument = () => {

    };
    delete = () => {

    };
    postpone = () => {

    };

    render() {
        let thoughts = this.thoughts;
        if (thoughts === undefined) {
            thoughts = [];
        }

        let markdownHover = (name: string, record: Thought, index: number) => {
            return <HoverCell onHover={() => this.showMarkdownPreview(record)}>{name}</HoverCell>;
        };

        return (
            <Row>
                <Col span={12}>
                    <Table rowKey='id' dataSource={thoughts}>
                        <Column dataIndex='created' title='Created' render={dateCell}/>
                        <Column dataIndex='name' title='Name' render={markdownHover}/>
                        <Column dataIndex='repositoryId' title='Repository'/>
                        <Column key='action' title='Action' render={(text, record: Thought) => (
                            <div>
                                <ThoughtToTask asIcon thought={record}/>
                                <ThoughtToDocument asIcon thought={record}/>
                                <PostponeThought asIcon thought={record}/>
                                <DeleteThought asIcon thought={record}/>
                            </div>
                        )}/>
                    </Table>
                </Col>
                <Col span={12}>
                    <div style={{marginLeft: 20}}>
                        <ThoughtPreview showActions thought={this.previewThought} store={this.props.store}/>
                    </div>
                </Col>
            </Row>
        );
    }
}
