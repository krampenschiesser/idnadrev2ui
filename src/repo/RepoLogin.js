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
import {Article, Box, Header, LoginForm, Section, Toast} from "grommet";
import SiteTitle from "../navigation/SiteTitle";
import PageSettingsMenu from "../util/PageSettingsMenu";
import {isMobile} from "../store/UiMappers";
import {observable} from "mobx";

@inject("store", "uistore")
@observer
export default class RepoLogin extends Component {
    componentDidMount() {
        this.props.store.loadRepositories()
    }

    onSubmit = (form, repoid) => {
        console.log("Login " + repoid + "with " + form.username + ":" + form.password)
        this.props.store.openRepository(repoid, form.username, form.password)
    }

    redirect = () => {
        this.props.history.push("/repo");
    }

    render() {
        let hasRepo = this.props.match;
        const repoId = this.props.match.params.id
        hasRepo = hasRepo && repoId;
        const repo = this.props.store.repositories.get(repoId)
        hasRepo = hasRepo && repo;

        let content;
        let title;
        if (hasRepo) {
            content = <LoginForm title={repo.name}
                                 onSubmit={(form) => this.onSubmit(form, repoId)}
                                 usernameType='text'/>
            title = "Login into repository \"" + repo.name + "\""
        } else {
            content = "No data"
            title = "Repository unknown"
        }

        if (hasRepo && repo.token) {
            content = <Toast status="ok" onClose={this.redirect}>You are successfully logged in to {repo.name}</Toast>
            setTimeout(this.redirect, 3000)
        }

        const mobile = isMobile(this);
        return (
            <Article>
                <SiteTitle title={title}>
                    {!mobile &&
                    <PageSettingsMenu />
                    }
                </SiteTitle>
                <Section>
                    <Box justify="center" align="center">
                        {content}
                    </Box>
                </Section>
            </Article>
        );
    }
}