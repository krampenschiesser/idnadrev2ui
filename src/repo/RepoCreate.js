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
import {observer, inject} from "mobx-react";
import {
    Article, Box, Footer, Form, FormField, FormFields, Header, Heading, Section,
    Select,
} from "grommet";
import validatorjs from "validatorjs";
import SiteTitle from "../navigation/SiteTitle";
import PageSettingsMenu from "../util/PageSettingsMenu";
import {isMobile} from "../store/UiMappers";
import CreateRepository from "../store/remote/CreateRepository";
import MobxReactForm from 'mobx-react-form';
import FormTextInput from "../form/FormTextInput";
import FormSubmitButton from "../form/FormSubmitButton";


const fields = {
    name: {
        label: 'Repository name',
        placeholder: 'Enter repository Name',
        rules: 'required|string',
    },
    password: {
        label: 'Password',
        rules: 'required|string',
    },
    encryption: {
        label: 'Encryption type',
        rules: 'required|string',
        default: 'ChaCha',
        value: 'ChaCha'
    },
    userName: {
        value: "root"
    }
};


class CreateRepoForm extends MobxReactForm {
    store = null;
    history = null;

    onSuccess(form) {
        const values = form.values();
        const cmd = Object.assign(new CreateRepository(), values)
        this.store.createRepository(cmd);
        form.reset();
        this.history.push("/repo")
    }

    onError(form) {
        form.invalidate('This is a generic error message!');
    }
}


const plugins = {dvr: validatorjs};
const form = new CreateRepoForm({fields}, {plugins});


@inject("store", "uistore")
@observer
export default class RepoCreate extends Component {
    componentDidMount() {
        form.store = this.props.store;
        form.history = this.props.history;
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
        const mobile = isMobile(this);
        return (
            <Article>
                <SiteTitle title="Create new repository">
                    {!mobile &&
                    <PageSettingsMenu />
                    }
                </SiteTitle>
                <Section>
                    <Box justify="center" align="center">
                        <Form onSubmit={form.onSubmit}>
                            <Header><Heading>Create repository</Heading></Header>
                            <FormFields>
                                <FormField label={form.$('name').label} error={form.$('name').error}>

                                    <FormTextInput autoFocus={true} ref={(i) => this.nameInput = i} form={form}
                                                   name="name"/>
                                </FormField>
                                <FormField label={form.$('encryption').label} error={form.$('encryption').error}>
                                    <Select
                                        {...form.$("encryption").bind()}
                                        onChange={form.$('encryption').sync}
                                        options={['ChaCha', 'AES']}
                                    />
                                </FormField>
                                <FormField label={form.$('password').label} error={form.$('password').error}>
                                    <FormTextInput form={form}
                                                   name="password" type="password"/>
                                </FormField>

                            </FormFields>
                            <Footer>
                                <FormSubmitButton onClick={this.onSubmit} form={form}/>
                            </Footer>
                        </Form>
                    </Box>
                </Section>
            </Article>
        );
    }
}