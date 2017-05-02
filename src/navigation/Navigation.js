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


import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import MainMenu from "./MainMenu.js";
import {Sidebar, Button, Header, Title, CloseIcon} from 'grommet'
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import {navState,navTree,navVisible} from "./../store/UiMappers.js"

@inject("uistore")
@observer
class NavTitle extends Component {
    onClose = () => {
        navState(this).hide();
    };

    goBack = () => {

        const tree = navTree(this);
        if (tree.back) {
            navState(this).setTree(tree.back);
        }
    };

    render() {
        const back = this.props.back;
        return (
            <Header pad='medium' justify='between'>
                {back && <Button icon={<CaretBackIcon/>}
                                 onClick={this.goBack}
                                 href='#'/>}
                <Title>
                    {this.props.title}
                </Title>
                <Button icon={<CloseIcon />}
                        onClick={this.onClose}
                        href='#'/>
            </Header>
        );
    }
}

@inject("uistore")
@observer
export default class Navigation extends Component {
    render() {
        const visible = navVisible(this);
        let tree = navTree(this);
        const items = tree.items;

        if (visible) {
            return (
                <Sidebar colorIndex='neutral-1'>
                    <NavTitle back={tree.canGoBack()} title={tree.name}/>
                    <MainMenu items={items}/>
                </Sidebar>
            );
        } else {
            return null;
        }
    }
}