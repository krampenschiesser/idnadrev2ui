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
import {observer} from 'mobx-react';
import MarkdownEditor from "../util/MarkdownEditor";

@observer
export default class FormMarkdownEditor extends Component {
    render() {
        const {form, name, ...props} = this.props;
        return (
            <MarkdownEditor
                {...props}
                onChange={form.select(name).sync}
                value={form.select(name).values()}/>
        );
    }
}