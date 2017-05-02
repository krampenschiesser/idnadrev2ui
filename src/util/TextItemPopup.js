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
import {observer} from 'mobx-react'
import TagContainer from "../tag/TagContainer"
import {Markdown, Timestamp, Section, Article, Header, Title, Footer, Box, Label} from "grommet"
import Spinning from 'grommet/components/icons/Spinning';

@observer
export default class TaskPopup extends Component {
  render() {
    const item = this.props.item;
    if (!item) {
      return <p>no item</p>
    }

    return (
      <Article>
        <Header>
          <Title>
            {item.name}
          </Title>
        </Header>
        <Section>
          {item.content ? <Markdown content={item.content}/> : <Spinning size="large"/>}
        </Section>
        <Footer>
          <Box>
            <TagContainer margin="none" showLabel={true} tags={item.tags}/>

            <Box responsive={false} pad="none" align="baseline" direction="row">
              <Box>
                <Label margin="small">Created:</Label>
              </Box>
              <Box pad={{horizontal: 'small'}}>
                <Timestamp value={item.created}/>
              </Box>
            </Box>
          </Box>
        </Footer>
      </Article>
    );
  }
}