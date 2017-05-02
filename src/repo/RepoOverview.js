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


import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import {observable} from "mobx";
import {Split, Article, Section, CheckBox, Tiles, Tile, Card, Box} from "grommet";
import AddCircleIcon from 'grommet/components/icons/base/AddCircle';

import SiteTitle from '../navigation/SiteTitle.js';
import {
  isMobile,
} from "../store/UiMappers.js"

import PageSettingsMenu from "../util/PageSettingsMenu.js";
import RepoView from "./RepoView";
import {Redirect} from "react-router-dom";
import {isOpen} from "../store/idnadrev/Repository";

@inject("store", "uistore")
@observer
export default class ThoughtOverview extends Component {
  @observable redirectUrl = null;

  componentDidMount() {
    this.props.store.loadRepositories()
  }

  onRepoSelect = (repo) => {
    if (isOpen(repo)) {
      this.redirectUrl="/repo/logout/"+repo.id
    } else {
      this.redirectUrl="/repo/login/"+repo.id
    }
  }


  render() {
    const store = this.props.store;
    const repos = store.repositories.values()
    const mobile = isMobile(this);
    return (
      <Article>
        {this.redirectUrl && <Redirect to={this.redirectUrl}/> }
        <SiteTitle title="Repositories">
          {!mobile &&
          <PageSettingsMenu />
          }
        </SiteTitle>
        <Section>
          <Tiles fill={true} flush={false}>
            {
              repos.map(r => {
                return (
                  <Tile onClick={() => this.onRepoSelect(r)} colorIndex="light-2" key={r.id}>
                    <RepoView repo={r}/>
                  </Tile>
                )
              })
            }
            <Tile colorIndex="light-2">
              <Card label="more" heading="Create repository">
                <Box justify="center" align="center" direction="row" responsive={false}>
                  <AddCircleIcon colorIndex="accent-2" type="logo " size="large"/>
                </Box>
              </Card>
            </Tile>
          </Tiles>
        </Section>
      </Article>
    );
  }
}