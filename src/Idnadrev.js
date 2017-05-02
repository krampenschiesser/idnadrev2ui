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
import {App, Split} from 'grommet'

import Navigation from "./navigation/Navigation.js"
import SiteContent from "./navigation/SiteContent.js"

@inject("uistore")
@observer
class MySplit extends Component {
    render() {
        let priority = 'right';
        if (this.props.uistore.mobile && this.props.uistore.navigationState.visible) {
            priority = 'left';
        }
        return (
            <Split flex='right' priority={priority}>
                {this.props.children}
            </Split>
        );
    }
}

export default class Idnadrev extends Component {
    render() {
        return (
            <App centered={false}>
                <MySplit>
                    <Navigation />
                    <SiteContent>
                        {this.props.children}
                    </SiteContent>
                </MySplit>
            </App>
        );
    }
}