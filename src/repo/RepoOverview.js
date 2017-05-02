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
import {observer, inject} from "mobx-react";
import {Split, Article, Section, CheckBox} from "grommet";

import SiteTitle from '../navigation/SiteTitle.js';
import {
    isMobile,
} from "../store/UiMappers.js"

import PageSettingsMenu from "../util/PageSettingsMenu.js";

@inject("store", "uistore")
@observer
export default class ThoughtOverview extends Component {


    render() {
        const store = this.props.store;
        const mobile = isMobile(this);
        return (
            <Article>
                <SiteTitle title="Repositories">
                    {!mobile &&
                    <PageSettingsMenu />
                    }
                </SiteTitle>
                <Section>
                </Section>
            </Article>
        );
    }
}