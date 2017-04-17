/**
 * Created by scar on 4/11/17.
 */

import React, {Component} from "react"
import {observer, inject} from 'mobx-react';
import {Box, Header, Title} from "grommet"

import ShowNavButton from "./ShowNavButton.js"
import {isMobile, navVisible} from "./../store/UiMappers.js"

@inject("uistore")
@observer
export default class SiteTitle extends Component {
    render() {
        const visible = navVisible(this);
        const mobile = isMobile(this);

        const showButton = !visible || mobile;

        return (
            <Header>
                {showButton && <ShowNavButton/>}
                <Box direction="row" flex={true} justify="center" full="horizontal" responsive={false}>
                    <Title>
                        {this.props.title}
                    </Title>
                </Box>
                {this.props.children}
            </Header>
        );
    }
}