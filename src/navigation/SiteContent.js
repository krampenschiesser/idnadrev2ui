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
import {Box,Article,Section} from "grommet"
import SiteTitle from "./../navigation/SiteTitle.js"

export default class SiteContent extends Component {
    render() {
        let content = this.props.children;
        if (!content || content.length === 0) {
            content = (
                <Article>
                    <SiteTitle title="Home" />
                    <Section>
                        <h3>Welcome to idnadrev</h3>
                    </Section>
                </Article>
            );
        }
        return (
            <Box pad="medium" full={true}>
                {content}
            </Box>
        );
    }
}