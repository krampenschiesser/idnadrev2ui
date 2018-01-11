import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import UiStore from '../../store/UiStore';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';
import Task from '../../dto/Task';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import TaskPreview from './TaskPreview';
import HoverCell from '../table/HoverCell';
import {FileId} from '../../dto/FileId';


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
        this.props.store.getUnfinishedTasks().then((t: Task[]) => {
            this.tasks = t;
        }).catch(e => {
            console.error('Could not load tasks', e);
            console.error(e);
        });

    }

    showMarkdownPreview = (task: Task) => {
        this.previewTask = task;
    };

    render() {
        const tasks: Task[] = this.tasks === undefined ? [] : this.tasks;
        console.log(tasks.length);
        let map: Map<FileId, Task> = new Map();

        tasks.forEach(t => {
            map.set(t.id, Object.assign(new Task(''), t));
        });

        let data: Task[] = [];
        map.forEach((t, key) => {
            if (t.details.parent) {
                let parent = map.get(t.details.parent);
                if (parent) {
                    let childArray = parent.children;
                    if (!childArray) {
                        childArray = [];
                        parent.children = childArray;
                    }
                    let item = map.get(t.id);
                    if (item) {
                        childArray.push(item);
                    }
                }
            }else {
                data.push(t)
            }
        });

        let markdownHover = (name: string, record: Task, index: number) => {
            return <HoverCell onHover={() => this.showMarkdownPreview(record)}>{name}</HoverCell>;
        };
        return (
            <Row>
                <Col span={12}>
                    <Table rowKey='id' dataSource={data}>
                        <Column dataIndex='name' title='Name'/>
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
