import * as React from 'react';
import Icon from 'antd/lib/icon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

export interface ViewThoughtProps {
    icon: string
    title: string
    callback: React.MouseEventHandler<any>
    hoverColor?: string
}

@observer
export default class TableCellAction extends React.Component<ViewThoughtProps, object> {
    @observable hover: boolean = false;

    render() {
        let actionStyle = {fontSize: 20, marginRight: '10px', cursor: 'pointer'};
        if (this.hover) {
            let color = this.props.hoverColor ? this.props.hoverColor : '#1890ff';
            actionStyle['color'] = color;
        }
        console.log(actionStyle);

        return (
            <span onMouseEnter={() => this.hover = true} onMouseLeave={() => this.hover = false}>
                <Icon onClick={this.props.callback} style={actionStyle} title={this.props.title}
                      type={this.props.icon}/>
            </span>
        );
    }
}
