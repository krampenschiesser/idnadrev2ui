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
import {Select} from "grommet";
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';

class RepoDisplay {
  value;
  label;

  constructor(id, name) {
    this.value = id;
    this.label= name;
  }
}

@inject("store")
@observer
export default class FormRepoSelection extends Component {

  onChange = (e) => {
    const store = this.props.store;
    store.setSelectedRepositoryId(e.value.value)
  }

  render() {
    const {store, ...props} = this.props;
    const repoId = store.selectedRepositoryId;
    const repoName = store.getRepository(repoId).name;


    const display = new RepoDisplay(repoId,repoName)
    const options = store.openRepositories.map(repo => new RepoDisplay(repo.id, repo.name))
    return (
      <Select
        value={display}
        options={options}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}