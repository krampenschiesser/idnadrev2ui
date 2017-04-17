/**
 * Created by scar on 4/8/17.
 */

import React, {Component} from "react";
import {observer,inject} from "mobx-react";
import {Table} from "grommet"
import styles from "./TaskTable.css.js"
import TaskTableItem from "./TaskTableItem";

@inject("uistore","store")
@observer
export class TaskTable extends Component {
    render() {
        const tasks = this.props.store.tasks;
        return (
            <Table selectable={true}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th style={styles.createdCol}>Created</th>
                    </tr>
                </thead>
                <tbody>
                {tasks.map(task =>
                    <TaskTableItem key={task.id} task={task} onShow={this.props.onShow} uistore={this.props.uistore}/>
                )}
                </tbody>
            </Table>
        );
    }
}
