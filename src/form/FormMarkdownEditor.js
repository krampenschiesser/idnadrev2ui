/**
 * Created by scar on 4/14/17.
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