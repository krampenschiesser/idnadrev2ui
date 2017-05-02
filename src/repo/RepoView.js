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
import {Anchor, Box, Button, Card, Label} from "grommet";
import UnlockIcon from 'grommet/components/icons/base/Unlock';
import LockIcon from 'grommet/components/icons/base/Lock';
import {isOpen} from "../store/idnadrev/Repository";

@inject("store", "uistore")
@observer
export default class RepoView extends Component {


  render() {
    const repo = this.props.repo;
    const label = repo.local ? "Local repository" : "Remote repository"
    console.log(repo)
    console.log(repo.isOpen)
    console.log("" + repo.isOpen)


    const image = isOpen(repo) ? <UnlockIcon colorIndex="ok"/> : <LockIcon colorIndex="warning"/>;
    const msg = isOpen(repo) ? <Label>Repository is unlocked</Label> : <Label>Repository is locked</Label>;
    const link = isOpen(repo) ? <Anchor label="Close repository" href="#" /> : <Anchor label="Open repository" path={"/repo/login/"+repo.id} />;
    const logline = (
      <Box direction="row" responsive={false} align="baseline">
        <Box>
          {msg}
        </Box>
        <Box margin="small">
          {image}
        </Box>
      </Box>
    );
    return (
      <Card  label={label}
            heading={repo.name}>
        {logline}
      </Card>
    );
  }
}