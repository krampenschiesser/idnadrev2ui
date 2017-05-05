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
import ThoughtItem from "./ThoughtItem.js";
import {observer,inject} from "mobx-react";
import {Table} from "grommet"
import styles from "./ThoughtTable.css.js"

@inject("uistore")
@observer
class ThoughtTable extends Component {
    render() {
        const thoughts = this.props.store.thoughts;
        return (
            <Table selectable={true}>
                <thead>
                    <tr>
                        <th style={styles.createdCol}>Created</th>
                        <th>Name</th>
                        <th>Repository</th>
                        <th style={styles.actionCol}>Action</th>
                    </tr>
                </thead>
                <tbody>
                {thoughts.map(thought =>
                    <ThoughtItem key={thought.id} thought={thought} onShow={this.props.onShow} uistore={this.props.uistore} store={this.props.store}/>
                )}
                </tbody>
            </Table>
        );
    }
}

export default ThoughtTable