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
