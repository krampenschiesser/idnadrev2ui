import * as React from 'react';
import Icon from 'antd/lib/icon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Button from 'antd/lib/button/button';
import Thought from '../../dto/Thought';
import {GlobalStore} from "../../store/GlobalStore";

export interface ThoughtActionProps {
    hoverColor?: string
    asIcon?: boolean;
    thought: Thought;
    store: GlobalStore;
}


class ThoughtAction extends React.Component<ThoughtActionProps, object> {
    @observable hover: boolean = false;

    callback = (thought: Thought, store: GlobalStore) => {
    };

    icon: string;
    title: string;

    constructor(callback: (thought: Thought, store: GlobalStore) => void, icon: string, title: string, props: ThoughtActionProps) {
        super(props);
        this.callback = callback;
        this.icon = icon;
        this.title = title;
    }

    render() {
        let actionStyle = {fontSize: 20, marginRight: '10px', cursor: 'pointer'};
        if (this.hover) {
            let color = this.props.hoverColor ? this.props.hoverColor : '#1890ff';
            actionStyle['color'] = color;
        }

        if (this.props.asIcon) {
            return (
                <span onMouseEnter={() => this.hover = true} onMouseLeave={() => this.hover = false}>
                    <Icon onClick={() => this.callback(this.props.thought, this.props.store)} style={actionStyle}
                          title={this.title}
                          type={this.icon}/>
                </span>
            );
        } else {
            return <Button icon={this.icon}
                           onClick={() => this.callback(this.props.thought, this.props.store)}>{this.title}</Button>;
        }
    }
}

@observer
export class ThoughtToTask extends ThoughtAction {
    constructor(props: ThoughtActionProps) {
        super(toTask, 'schedule', 'To Task', props);
    }
}

@observer
export class ThoughtToDocument extends ThoughtAction {
    constructor(props: ThoughtActionProps) {
        super(toDocument, 'book', 'To Document', props);
    }
}

@observer
export class PostponeThought extends ThoughtAction {
    constructor(props: ThoughtActionProps) {
        super(postponeThought, 'hourglass', 'Postpone', props);
    }
}

@observer
export class DeleteThought extends ThoughtAction {
    constructor(props: ThoughtActionProps) {
        super(deleteThought, 'delete', 'Delete', props);
    }
}

function toTask(thought: Thought, store: GlobalStore): void {

}

function toDocument(thought: Thought, store: GlobalStore): void {

}

function postponeThought(thought: Thought, store: GlobalStore): void {

}

function deleteThought(thought: Thought, store: GlobalStore): void {

}