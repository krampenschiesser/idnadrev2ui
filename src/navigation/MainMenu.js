/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
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