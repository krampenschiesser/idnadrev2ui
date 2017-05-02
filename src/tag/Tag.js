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
import {Anchor, Box} from "grommet";
import TagIcon from 'grommet/components/icons/base/Tag';

export default class Tag extends Component {
    render() {
        return (
            <Box responsive={false} direction="row" pad={{horizontal: 'small'}}>
                <Anchor key={this.props.tag} icon={this.props.icon ? this.props.icon : <TagIcon/>} label={this.props.tag} reverse={true}
                        onClick={this.props.onClick}/>
            </Box>
        );
    }
}