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
import {Box, Button} from "grommet";

export default class  extends Component {
    render() {
        const {align, form, onClick, ...props} = this.props;
        const valid = form.isValid;
        return (
            <Box align={align || "center"} flex={true}>
                <Button
                    {...props}
                    label="Submit" type="submit"
                    primary={true} fill={false}
                    onClick={valid ? (onClick || form.submit()) : null}/>
            </Box>
        );
    }
}