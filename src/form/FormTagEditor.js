/**
 * Created by scar on 4/14/17.
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