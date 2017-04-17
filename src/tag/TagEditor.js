/**
 * Created by scar on 4/13/17.
 */

import React, {Component} from "react"
import {isMobile} from "../store/UiMappers";
import {observer, inject} from 'mobx-react';
import {Box, Button, TextInput} from "grommet";
import AddCircleIcon from 'grommet/components/icons/base/AddCircle';
import {observable, action} from "mobx";

const textPadding = {
    paddingLeft: '23px',
};


@inject("uistore")
@observer
export default class TagEditor extends Component {
    @observable tag = null;

    handleTagInput = (e) => {
        if (e.key === "Enter") {
            const tagName = e.target.value;
            this.onAddTag(tagName);

            e.preventDefault();
            e.stopPropagation();
        }
    };

    @action
    onAddTag = (tag) => {
        this.props.addTag(tag);
        this.tag = null;
    }


    render() {
        const mobile = isMobile(this);
        const allTags = this.props.allTags;
        return (
            <Box style={textPadding} full="horizontal" direction="row" responsive={false}>
                <TextInput name="temporary" onKeyPress={this.handleTagInput} suggestions={allTags}
                           onSelect={(e) => this.onAddTag(e.suggestion)}
                           onDOMChange={(e) => this.tag = e.target.value} value={this.tag || ""}/>
                {mobile &&
                <Box>
                    <Button plain={true} icon={<AddCircleIcon />} onClick={() => this.onAddTag(this.tag)}/>
                </Box>
                }
            </Box>
        );
    }
}