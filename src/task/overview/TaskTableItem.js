/**
 * Created by scar on 4/8/17.
 */

import React, {Component} from "react";
import {TableRow, Layer} from "grommet"
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import TextItemPopup from "../../util/TextItemPopup";


@observer
export default class TaskTableItem extends Component {
  @observable showLayer = false;

  render() {
    const showLayer = this.showLayer;
    const task = this.props.task;
    const layer = (
      <Layer closer={true} onClose={() => this.showLayer = false}>
        <TextItemPopup item={task}/>
      </Layer>
    );
    const callback = () => this.showLayer = true;
    return (
      <TableRow onMouseEnter={() => this.props.onShow(task)}>
        <td onClick={callback}>
          {task.name}
          {showLayer && layer}
        </td>
        <td onClick={callback}>{task.created.toLocaleString()}</td>
      </TableRow>
    );
  }
}
