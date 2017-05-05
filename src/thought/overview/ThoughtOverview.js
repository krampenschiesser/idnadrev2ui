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
import ThoughtTable from "./ThoughtTable.js";
import {observer, inject} from "mobx-react";
import {Split, Article, Section, CheckBox} from "grommet";

import SiteTitle from "../../navigation/SiteTitle";
import {
  thoughtOverviewState,
  getSelectedThought,
  isThoughtPreviewEnabled,
  isMobile,
} from "../../store/UiMappers.js"

import PageSettingsMenu from "../../util/PageSettingsMenu";
import TextItemPreview from "../../util/TextItemPreview";

@inject("store", "uistore")
@observer
export default class ThoughtOverview extends Component {
  showThought(thought) {
    thoughtOverviewState(this).selectThought(thought);
  }

  toggleHoverPreview = () => {
    thoughtOverviewState(this).toggleHoverPreview();
  };

  componentDidMount() {
    this.props.store.loadThoughts();
  }


  render() {
    const store = this.props.store;
    const selected = getSelectedThought(this);
    const previewEnabled = isThoughtPreviewEnabled(this);
    const mobile = isMobile(this);
    return (
      <Article>
        <SiteTitle title="Overview">
          {!mobile &&
          <PageSettingsMenu>
            <CheckBox id="1" label="Hover preview" defaultChecked={previewEnabled}
                      onChange={this.toggleHoverPreview}/>
          </PageSettingsMenu>
          }
        </SiteTitle>
        <Section>
          <Split priority='left'>
            <ThoughtTable store={store} onShow={(thought) => this.showThought(thought)}/>
            {previewEnabled && <TextItemPreview item={selected}/>}
          </Split>
        </Section>
      </Article>
    );
  }
}