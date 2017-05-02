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