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
import {Split, Article, Section, CheckBox} from "grommet";
import TaskTree from "./TaskTree";
import {isMobile, taskOverViewState} from "../../store/UiMappers";
import PageSettingsMenu from "../../util/PageSettingsMenu";
import SiteTitle from "../../navigation/SiteTitle";
import TextItemPreview from "../../util/TextItemPreview";
import {TaskTable} from "./TaskTable";

@inject("uistore", "store")
@observer
export default class TaskOverview extends Component {
  render() {
    const mobile = isMobile(this);
    const state = taskOverViewState(this);
    const selected = state.selected;
    const previewEnabled = state.showHoverPreview;
    const showTreeView = state.showTreeView;

    return (
      <Article>
        <SiteTitle title="Overview">
          {!mobile &&
          <PageSettingsMenu >
            <CheckBox id="1" label="Hover preview" defaultChecked={previewEnabled}
                      onChange={() => state.toggleHoverPreview()}/>
            <CheckBox id="2" label="Display as treeview" defaultChecked={state.showTreeView}
                      onChange={() => state.toggleTreeList()}/>
          </PageSettingsMenu>
          }
        </SiteTitle>
        <Section>
          <Split priority='left'>
            {showTreeView ? <TaskTree onShow={(t) => state.select(t)}/> :
              <TaskTable onShow={(t) => state.select(t)}/>
            }
            {previewEnabled && <TextItemPreview item={selected}/>}
          </Split>
        </Section>
      </Article>
    );
  }
}