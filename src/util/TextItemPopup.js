/**
 * Created by scar on 4/9/17.
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