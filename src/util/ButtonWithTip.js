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
import {Button, Box} from "grommet";


export default class ButtonWithTip extends Component {
    render() {
        return (
            <Box direction="row" flex={true} justify="start">
                <Button data-tip={this.props.tooltip ? this.props.tooltip : null} label={this.props.label}
                        onClick={this.props.onClick} icon={this.props.icon}
                        accent={this.props.accent}/>
            </Box>
        );
    }
}