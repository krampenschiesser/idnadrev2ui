import * as React from 'react';
import { Layout, Icon } from 'antd';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { NavigationMenu, NavigationTitle } from './NavigationMenu';
import UiStore from '../store/UiStore';

const {Header, Sider, Content} = Layout;

export interface NavigationContainerProps {
  children: {};
  uiStore: UiStore;
}

@inject('uiStore')
@observer
export class NavigationContainer extends React.Component<NavigationContainerProps, object> {
  @observable menuVisible: boolean;

  toggle = () => {
    this.menuVisible = !this.menuVisible;
  };

  render() {
    return (
      <Layout style={{height: '100vh'}}>
        <Sider
          trigger={null}
          breakpoint='sm'
          collapsible={true}
          collapsedWidth={0}
          collapsed={this.menuVisible}
        >
          <NavigationMenu uiStore={this.props.uiStore}/>
        </Sider>
        <Layout>
          <Header style={{background: '#fff', padding: 0}}>

            <h1>
              <Icon
                style={{fontSize: 24, cursor: 'pointer', margin: '20px 12px 12px 16px'}}
                type={this.menuVisible ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <NavigationTitle uiStore={this.props.uiStore}/>
            </h1>
          </Header>
          <Content style={{margin: '24px 16px 0'}}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>

    );
  }
}