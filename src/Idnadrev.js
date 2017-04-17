/**
 * Created by scar on 4/11/17.
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