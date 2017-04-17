/**
 * Created by scar on 4/14/17.
 */

import React, {Component} from "react"
import {observer, inject} from 'mobx-react';
import {isMobile, showTooltips, uistore} from "../store/UiMappers";
import {Box, CheckBox, Menu} from "grommet";
import SettingsOptionIcon from 'grommet/components/icons/base/SettingsOption';

@inject("uistore")
@observer
export default class PageSettingsMenu extends Component {

    toggleTooltips = () => {
        uistore(this).toggleTooltips();
    };

    render() {
        const mobile = isMobile(this);
        const tooltipsEnabled = showTooltips(this);
        if (!mobile) {
            return (
                <Box pad='medium' flex={false} justify='end' direction='row'>
                    <Menu closeOnClick={false} responsive={false} icon={<SettingsOptionIcon />}>
                        <br/>
                        {this.props.children}
                        <CheckBox id="2" label="Show tooltips" defaultChecked={tooltipsEnabled}
                                  onChange={this.toggleTooltips}/>
                    </Menu>
                </Box>
            );
        }
        // return null;
    }
}