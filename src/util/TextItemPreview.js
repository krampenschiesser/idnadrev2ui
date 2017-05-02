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
import {observer,inject} from 'mobx-react'
import TagContainer from "../tag/TagContainer"
import {Markdown, Timestamp, Card, Box, Label} from "grommet"
import Spinning from 'grommet/components/icons/Spinning';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';


@inject("store")
@observer
export default class TextItemPreview extends Component {
  render() {
    const item = this.props.item;
    if (!item) {
      return <ListPlaceholder filteredTotal={0} unfilteredTotal={0} />
    }
    if(!item.content){
      this.props.store.loadContent(item.id)
    }

    let content = (
      <Box>
        {item.content ? <Markdown content={item.content}/> : <Spinning size="large"/>}
        <TagContainer margin="small" showLabel={true} tags={item.tags}/>
        <Box pad="none" align="baseline" direction="row">
          <Box>
            <Label margin="none">Created:</Label>
          </Box>
          <Box pad={{horizontal: 'small'}}>
            <Timestamp value={item.created}/>
          </Box>
        </Box>
      </Box>
    );

    return (
      <Box full={true} pad={{horizontal: 'large'}}>
        <Card contentPad='none' heading={item.name} description={content}/>
      </Box>
    );
  }
}