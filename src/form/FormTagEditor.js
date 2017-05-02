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
import {Box} from "grommet";
import TagEditor from "../tag/TagEditor";
import TagContainer from "../tag/TagContainer";
import {observer} from 'mobx-react';

const editorPadding = {
    padding: '11px 23px',
};

@observer
export default class TagFormEditor extends Component {

    removeTag = (tag) => {
        const form = this.props.form;
        const values = form.select(this.props.name).values() || [];
        const newValues = values.filter((e) => e !== tag);
        form.select(this.props.name).sync(newValues);
    }

    addTag = (tag) =>{
        const form = this.props.form;
        const values = form.select(this.props.name).values() || [];
        if (values.indexOf(tag) === -1) {
            values.push(tag);
            form.select(this.props.name).sync(values);
        }
    }

    render() {
        const {allTags, form, ...props} = this.props;
        const tagValues = form.select(this.props.name).values();
        return (
            <Box>
                <TagEditor {...props} allTags={allTags} addTag={this.addTag}/>
                <TagContainer {...props} style={editorPadding} onRemove={this.removeTag}
                              tags={tagValues}/>
            </Box>
        );
    }
}