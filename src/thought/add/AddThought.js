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
import {observer, inject} from 'mobx-react';
import {
    Article, Box, Footer, Form, FormField, FormFields, Section
} from "grommet";

import SiteTitle from "../../navigation/SiteTitle";

import MobxReactFormDevTools from 'mobx-react-form-devtools';
import MobxReactForm from 'mobx-react-form';
import validatorjs from "validatorjs";
import TagFormEditor from "../../form/FormTagEditor";
import FormTextInput from "../../form/FormTextInput";
import FormMarkdownEditor from "../../form/FormMarkdownEditor";
import FormSubmitButton from "../../form/FormSubmitButton";
import Thought from "../../store/idnadrev/Thought";

const fields = {
    name: {
        label: 'Name',
        placeholder: 'Insert Name',
        rules: 'required|string',
    },
    content: {
        label: 'Content',
        rules: 'string',
    },
    tags: {
        label: 'Tags',
        rules: 'array',
    }
};


class AddThoughtForm extends MobxReactForm {
    store = null;

    onSuccess(form) {
        const values = form.values();

        const thought = new Thought(values.name);
        thought.tags = values.tags;
        thought.content = values.content;
        this.store.addFile(thought);
        form.reset();
    }

    onError(form) {
        form.invalidate('This is a generic error message!');
    }
}

const plugins = {dvr: validatorjs};
const form = new AddThoughtForm({fields}, {plugins});

MobxReactFormDevTools.register({
    form,
});
MobxReactFormDevTools.select('registerForm');
MobxReactFormDevTools.open(false);


@inject("store", "uistore")
@observer
export default class AddThought extends Component {

    componentDidMount() {
        form.store = this.props.store;
        this.refocus();
    }

    refocus() {
        this.nameInput.focus();
    }


    onSubmit = (e) => {
        e ? form.submit(e) : form.submit();
        this.refocus();
    }


    render() {
        const allTags = this.props.store.tags;

        return (
            <Article >
                <SiteTitle title="Add Thought"/>
                <Section>
                    <Box direction="row" full={true} justify="center" responsive={false}>
                        <Form onSubmit={form.onSubmit}>
                            <FormFields>
                                <FormField label={form.$('name').label} error={form.$('name').error}>
                                    <FormTextInput autoFocus={true} ref={(i) => this.nameInput = i} form={form}
                                                   name="name"/>
                                </FormField>
                                <FormField label="Tags">
                                    <TagFormEditor form={form} name="tags" allTags={allTags}/>
                                </FormField>
                                <FormField label="content">
                                    <FormMarkdownEditor onSubmit={this.onSubmit} form={form} name="content"/>
                                </FormField>
                            </FormFields>
                            <Footer>
                                <FormSubmitButton onClick={this.onSubmit} form={form} />
                            </Footer>
                        </Form>
                    </Box>
                </Section>
            </Article>
        );
    }
}