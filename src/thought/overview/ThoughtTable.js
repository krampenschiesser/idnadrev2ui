/**
 * Created by scar on 4/8/17.
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
                        <th style={styles.actionCol}>Action</th>
                    </tr>
                </thead>
                <tbody>
                {thoughts.map(thought =>
                    <ThoughtItem key={thought.id} thought={thought} onShow={this.props.onShow} uistore={this.props.uistore}/>
                )}
                </tbody>
            </Table>
        );
    }
}

export default ThoughtTable