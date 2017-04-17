/**
 * Created by scar on 4/15/17.
 */

import React, {Component} from "react"
import {observer, inject} from 'mobx-react';
import {Table} from "grommet";
import TaskTreeItem from "./TaskTreeItem";
import {taskOverViewState, taskTree,isDesktop} from "../../store/UiMappers";
import styles from "./TaskTable.css.js"

@inject("uistore", "store")
@observer
export default class TaskTree extends Component {
  onExpand = (task) => {
    taskOverViewState(this).expand(task)
  }

  onCollapse = (task) => {
    taskOverViewState(this).collapse(task)
  }

  createChildren(task, all, level) {
    if (taskOverViewState(this).isExpanded(task.id)) {
      for (let id of task.children) {
        const child = this.props.store.files.get(id);
        all.push(this.createItem(child, level))
        this.createChildren(child, all, level + 1)
      }
    }
  }

  createItem(task, level) {
    const isExpanded = taskOverViewState(this).isExpanded(task.id);
    return <TaskTreeItem onShow={this.props.onShow}  level={level} parent={task.children} expanded={isExpanded} key={task.id} task={task}
                         onExpand={() => this.onExpand(task)}
                         onCollapse={() => this.onCollapse(task)}
    />
  }

  render() {
    const tasks = taskTree(this);

    let content = [];
    for (let task of tasks) {
      content.push(this.createItem(task, 0))
      this.createChildren(task, content, 1);
    }

    return (
      <Table selectable={true}>
        <thead>
        <tr>
          <th>Name</th>
          {isDesktop(this) && <th style={styles}>Created</th> }
        </tr>
        </thead>
        <tbody>
        {content}
        </tbody>
      </Table>

    );
  }
}