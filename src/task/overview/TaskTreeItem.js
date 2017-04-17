/**
 * Created by scar on 4/15/17.
 */

import React, {Component} from "react"
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';
import {Box, Button, Layer, TableRow, Timestamp} from "grommet";
import AddCircleIcon from 'grommet/components/icons/base/AddCircle';
import SubtractCircleIcon from 'grommet/components/icons/base/SubtractCircle';
import {isDesktop} from "../../store/UiMappers";
import TextItemPopup from "../../util/TextItemPopup";

@inject("uistore")
@observer
export default class TaskTreeItem extends Component {
  @observable showLayer;

  render() {
    const level = this.props.level;
    const task = this.props.task;
    const expanded = this.props.expanded;
    const expand = this.props.onExpand;
    const collapse = this.props.onCollapse;
    const parent = this.props.parent;

    const showLayer = this.showLayer;
    const layer = (
      <Layer closer={true} onClose={() => this.showLayer = false}>
        <TextItemPopup item={task}/>
      </Layer>
    );

    let btn;
    if (expanded) {
      btn = <Button icon={<SubtractCircleIcon />} onClick={collapse}/>
    } else {
      btn = <Button icon={<AddCircleIcon />} onClick={expand}/>
    }

    const padding = level + (parent ? 0 : 3)
    const style = {
      paddingLeft: padding + 'em',
    }

    const column = (
      <td style={style}>
        <Box align="baseline" direction="row" responsive={false}>
          {parent && btn}
          <Box onClick={() => this.showLayer = true} direction="row" responsive={false} full="horizontal">
              {task.name}
          </Box>
        </Box>
      </td>
    );


    return (
      <TableRow onMouseEnter={() => this.props.onShow(this.props.task)}>
        {showLayer && layer}
        {column}
        {isDesktop(this) && <td onClick={() => this.showLayer = true}><Timestamp value={task.created}/></td>}
      </TableRow>
    );
  }
}