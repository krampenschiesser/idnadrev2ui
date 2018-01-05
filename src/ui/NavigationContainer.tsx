import * as React from 'react';
import {Layout, Icon} from "antd";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {NavigationMenu} from "./NavigationMenu";

const {Header, Sider, Content} = Layout;

export interface NavigationContainerProps {
    children: any;
}

@observer
export class NavigationContainer extends React.Component<NavigationContainerProps, object> {
    @observable menuVisible: boolean;

    toggle = () => {
        this.menuVisible = !this.menuVisible
    };

    render() {
        return (
            <Layout style={{height:"100vh"}}>
                <Sider trigger={null}
                       breakpoint='sm'
                       collapsible={true}
                       collapsedWidth={0}
                       collapsed={this.menuVisible}
                >
                    <NavigationMenu />
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <Icon
                            style={{ fontSize: 24, cursor: 'pointer',margin: '20px 12px 12px 16px'}}
                            type={this.menuVisible ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>

        );
    }
}