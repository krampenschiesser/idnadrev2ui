/**
 * Created by scar on 4/11/17.
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