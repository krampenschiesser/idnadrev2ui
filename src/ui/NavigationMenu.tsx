import * as React from 'react';
import {Menu, Icon} from "antd";
// import {observable} from "mobx";
import {observer} from "mobx-react";


export interface NavigationMenuProps {

}

@observer
export class NavigationMenu extends React.Component<NavigationMenuProps, object> {
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="thought">
                    <Icon type="coffee" />
                    <span>Thought</span>
                </Menu.Item>
                <Menu.Item key="task">
                    <Icon type="schedule" />
                    <span>Task</span>
                </Menu.Item>
                <Menu.Item key="doc">
                    <Icon type="book" />
                    <span>Documents</span>
                </Menu.Item>
            </Menu>

        );
    }
}