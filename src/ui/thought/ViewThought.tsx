import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import Thought from '../../dto/Thought';
import UiStore from '../../store/UiStore';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import ThoughtPreview from './ThoughtPreview';
import {dateCell} from '../common/DateCell';


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

    onRow = (record: Thought, index: number) => {
        console.log(record)
        return <span>hhellllo</span>
    }

    render() {
        let thoughts = this.thoughts
        if (thoughts === undefined) {
            thoughts = []
        }

        return (
            <Row>
                <Col span={12}>
                    <Table onRow={this.onRow} rowKey='id' dataSource={thoughts}>
                        <Column dataIndex='created' title='Created' render={dateCell}/>
                        <Column dataIndex='name' title='Name'/>
                        <Column dataIndex='repositoryId' title='Repository'/>
                        <Column key='action' title='Action' render={(text, record) => (
                            <div>
                                <Icon title='To Task' type="schedule"/>
                                <Icon title='To Document' type="book"/>
                                <Icon title='Delete' type="delete"/>
                                <Icon title='Postpone' type="delete"/>
                            </div>
                        )}/>
                    </Table>
                </Col>
                <Col span={12}>
                    <ThoughtPreview thought={this.previewThought} store={this.props.store}/>
                </Col>
            </Row>
        );
    }
}
