/**
 * Created by scar on 4/11/17.
 */

import React, {Component} from "react"
import {Button} from "grommet"
import MenuIcon from 'grommet/components/icons/base/Menu';
import {observer, inject} from "mobx-react"
import {navState} from "./../store/UiMappers.js"

@inject("uistore")
@observer
export default class ShowNavButton extends Component {
    onClick = () => {
        navState(this).toggleVisibility();
    };

    render() {
        return (
            <Button icon={<MenuIcon />}
                    onClick={this.onClick}
                    href='#' />
        );
    }
}