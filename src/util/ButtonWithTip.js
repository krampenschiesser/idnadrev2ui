/**
 * Created by scar on 4/12/17.
 */

import React, {Component} from "react";
import {Button, Box} from "grommet";


export default class ButtonWithTip extends Component {
    render() {
        return (
            <Box direction="row" flex={true} justify="start">
                <Button data-tip={this.props.tooltip ? this.props.tooltip : null} label={this.props.label}
                        onClick={this.props.onClick} icon={this.props.icon}
                        accent={this.props.accent}/>
            </Box>
        );
    }
}