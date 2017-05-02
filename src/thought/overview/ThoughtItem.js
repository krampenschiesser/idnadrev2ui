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
import {TableRow, Layer, Box} from "grommet"
import TaskIcon from 'grommet/components/icons/base/Task';
import DocumentIcon from 'grommet/components/icons/base/Document';
import TrashIcon from 'grommet/components/icons/base/Trash';

import ButtonWithTip from "../../util/ButtonWithTip.js"

import {isMobile, showTooltips} from "../../store/UiMappers.js"
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import TextItemPopup from "../../util/TextItemPopup";

@observer
class ActionButton extends Component {
  render() {
    const showToolTips = showTooltips(this);
    const mobile = isMobile(this);
    const accent = !mobile;
    const icon = this.props.icon;
    const label = this.props.label;
    const onClick = this.props.onClick;
    return (
      <ButtonWithTip accent={accent} icon={icon}
                     onClick={onClick} tooltip={showToolTips && label}/>
    );
  }
}

@observer
export default class ThoughtItem extends Component {
  @observable showLayer = false;

  toTask = (event) => {
    event.preventDefault();
    console.log(event);
    console.log("to task");
  };
  toDocument = (event) => {
    event.preventDefault();
    console.log(event);
    console.log("to document");
  };
  delete = (event) => {
    console.log("deleting");
  };

  render() {
    const showLayer = this.showLayer;
    const layer = (
      <Layer closer={true} onClose={() => this.showLayer = false}>
        <TextItemPopup item={this.props.thought}/>
      </Layer>
    );
    const callback = () => this.showLayer = true;
    return (
      <TableRow onMouseEnter={() => this.props.onShow(this.props.thought)}>
        <td onClick={callback}>{this.props.thought.created.toLocaleString()}</td>
        <td onClick={callback}>{this.props.thought.name}</td>
        <td>
          {showLayer && layer}
          <Box direction="row" responsive={false}>
            <br/>
            <ActionButton label="To Task" icon={<TaskIcon />} uistore={this.props.uistore}
                          onClick={this.toTask}/>
            <ActionButton label="To Document" icon={<DocumentIcon />} uistore={this.props.uistore}
                          onClick={this.toDocument}/>
            <ActionButton label="Delete" icon={<TrashIcon />} uistore={this.props.uistore}
                          onClick={this.delete}/>
          </Box>
        </td>
      </TableRow>
    );
  }
}
