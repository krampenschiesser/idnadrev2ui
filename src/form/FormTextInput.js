/**
 * Created by scar on 4/14/17.
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