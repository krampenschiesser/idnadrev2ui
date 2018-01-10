import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import UiStore from '../../store/UiStore';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';
import Task from "../../dto/Task";
import Row from "antd/lib/grid/row";
import Col from "antd/lib/grid/col";
import TaskPreview from "./TaskPreview";
import HoverCell from "../table/HoverCell";


export interface ViewTaskProps {
    store: GlobalStore
    uiStore: UiStore
}

@inject('store', 'uiStore')
@observer
export default class ViewTask extends React.Component<ViewTaskProps, object> {
    @observable tasks: Task[];
    @observable previewTask: Task | null = null;

    componentWillMount() {
        this.props.uiStore.header = 'View Tasks';
    }

    componentDidMount() {
        this.props.store.getTasks().then((t: Task[]) => {
            this.thoughts = t;
        }).catch(e => {
            console.error('Could not load thoughts', e);
            console.error(e);
        });

    }

    showMarkdownPreview = (task: Task) => {
        this.previewTask = task;
    };

    rowSelection = () =>{

    };

    render() {
        const data = [{
            id: 1,
            name: 'Barbequeue',
            context: 'none',
            parent: null,
            content: '# hungry',
            updated: new Date(),
            tags: [],
            children: [
                {
                    id: 2,
                    name: 'Go to store',
                    context: 'car',
                    content: '__slow moving__**traffic**',
                    parent: 1,
                    updated: new Date(),
                    tags: [],
                    children: [
                        {
                            id: 3,
                            context: 'store',
                            name: 'Buy beef',
                            content: 'Yummy',
                            updated: new Date(),
                            parent: 2,
                            tags: []
                        }, {
                            id: 4,
                            context: 'store',
                            name: 'Buy beer',
                            content: 'Fuck yeah',
                            updated: new Date(),
                            parent: 2,
                            tags: []
                        },
                    ],
                }
            ]
        }, {
            id: 42,
            name: 'Take safety break',
            updated: new Date(),
            content: 'oh **yeah**',
            tags: []

        }];

        let markdownHover = (name: string, record: Task, index: number) => {
            return <HoverCell onHover={() => this.showMarkdownPreview(record)}>{name}</HoverCell>;
        };
        const rowSelection = {
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record: any, selected: any, selectedRows: any) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        return (
            <Row>
                <Col span={12}>
                    <Table rowSelection={rowSelection} rowKey='id' dataSource={data}>
                        <Column dataIndex='name' title='Name' />
                        <Column width='10%' dataIndex='context' title='Context' render={markdownHover}/>
                        <Column width='10%' dataIndex='repository' title='Repository'/>
                    </Table>
                </Col>
                <Col span={12}>
                    <div style={{marginLeft: 20}}>
                        <TaskPreview task={this.previewTask} store={this.props.store}/>
                    </div>
                </Col>
            </Row>

        );
    }
}
