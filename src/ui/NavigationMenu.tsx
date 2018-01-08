import * as React from 'react';
import {Menu, Icon} from 'antd';
// import {observable} from "mobx";
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import UiStore from '../store/UiStore';

const {SubMenu} = Menu;

export interface NavigationMenuProps {
    match?: any
    uiStore: UiStore
}

export interface NavigationTitleProps {
    uiStore: UiStore
}

@observer
export class NavigationTitle extends React.Component<NavigationTitleProps, object> {
    render() {
        let header = this.props.uiStore.header;
        return <span style={{marginLeft: '32px'}}>{header}</span>;
    }
}

@observer
export class NavigationMenu extends React.Component<NavigationMenuProps, object> {
    render() {
        let thoughtLink = <Link to='/thought'><Icon type="coffee"/>Thought</Link>;
        let thoughtViewLink = <Link to='/thought'><Icon type="desktop"/>View</Link>;
        let thoughtAddLink = <Link to='/thought/add'><Icon type="plus-circle-o"/>Add</Link>;

        let taskLink = <Link to='/task'><Icon type="schedule"/>Task</Link>;
        let taskViewLink = <Link to='/task'><Icon type="desktop"/>View</Link>;
        let taskAddLink = <Link to='/task/add'><Icon type="plus-circle-o"/>Add</Link>;

        let docLink = <Link to='/doc'><Icon type="book"/>Document</Link>;
        let docViewLink = <Link to='/doc'><Icon type="desktop"/>View</Link>;
        let docAddLink = <Link to='/doc/add'><Icon type="plus-circle-o"/>Add</Link>;

        let repoLink = <Link to='/repo'><Icon type="database"/>Repository</Link>;
        let repoViewLink = <Link to='/repo'><Icon type="desktop"/>View</Link>;
        let repoAddLink = <Link to='/repo/add'><Icon type="plus-circle-o"/>Add</Link>;

        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} inlineIndent={24}
                  defaultOpenKeys={['thought', 'task', 'doc', 'repo']}>

                <SubMenu key='thought' theme="dark" mode="inline" title={thoughtLink}>
                    <Menu.Item key="thought-view">
                        {thoughtViewLink}
                    </Menu.Item>
                    <Menu.Item key="thought-add">
                        {thoughtAddLink}
                    </Menu.Item>
                </SubMenu>

                <SubMenu key='task' theme="dark" mode="inline" title={taskLink}>
                    <Menu.Item key="task-view">
                        {taskViewLink}
                    </Menu.Item>
                    <Menu.Item key="task-add">
                        {taskAddLink}
                    </Menu.Item>
                </SubMenu>

                <SubMenu key='doc' theme="dark" mode="inline" title={docLink}>
                    <Menu.Item key="doc-view">
                        {docViewLink}
                    </Menu.Item>
                    <Menu.Item key="doc-add">
                        {docAddLink}
                    </Menu.Item>
                </SubMenu>

                <SubMenu key='repo' theme="dark" mode="inline" title={repoLink}>
                    <Menu.Item key="repo-view">
                        {repoViewLink}
                    </Menu.Item>
                    <Menu.Item key="repo-add">
                        {repoAddLink}
                    </Menu.Item>
                </SubMenu>
            </Menu>

        );
    }
}