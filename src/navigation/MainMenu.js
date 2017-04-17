/**
 * Created by scar on 4/11/17.
 */

import React, {Component} from "react"
import {observer, inject} from 'mobx-react';
import {action} from 'mobx';
import {Menu, Anchor} from 'grommet'

import {navState,isMobile} from "./../store/UiMappers.js"

@inject("uistore")
@observer
export default class MainMenu extends Component {

    @action
    selectSubtree = (newTree, name) => {
        let navigationState = navState(this);
        navigationState.tree = newTree;
    };
    @action
    selectItem = (name) => {
        if(isMobile(this)){
            navState(this).hide()
        }
    };

    renderItem(item) {
        const name = item.name;
        const subTree = item.subTree;
        if (subTree) {
            return (
                <Anchor key={item.name} path={item.path} onClick={() => this.selectSubtree(subTree, name)}>
                    {item.name}
                </Anchor>
            )
        } else {
            /*
             */
            return (
                <Anchor key={item.name} path={item.path} onClick={() => this.selectItem(name)}>
                    {item.name}
                </Anchor>
            )
        }
    }

    render() {
        return (
            <Menu primary={true}>
                {this.props.items.map(item => this.renderItem(item))}
            </Menu>
        );
    }
}