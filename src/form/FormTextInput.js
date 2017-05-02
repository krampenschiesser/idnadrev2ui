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
import {TextInput} from "grommet";
import {observer} from 'mobx-react';

@observer
export default class FormTextInput extends Component {
    focus() {
        this.ref && this.ref.componentRef.focus();
    }

    render() {
        const {name, form, autoFocus, ...props} = this.props;

        return (
            <TextInput {...props}
                       {...form.$(name).bind()}
                       onDOMChange={form.select(name).sync}
                       autoFocus={autoFocus || false}
                       ref={autoFocus ? (i) => this.ref = i : null}
            />
        );
    }
}