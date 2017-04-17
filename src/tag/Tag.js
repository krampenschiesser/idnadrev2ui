/**
 * Created by scar on 4/12/17.
 */

import React, {Component} from "react"
import {Anchor, Box} from "grommet";
import TagIcon from 'grommet/components/icons/base/Tag';

export default class Tag extends Component {
    render() {
        return (
            <Box responsive={false} direction="row" pad={{horizontal: 'small'}}>
                <Anchor key={this.props.tag} icon={this.props.icon ? this.props.icon : <TagIcon/>} label={this.props.tag} reverse={true}
                        onClick={this.props.onClick}/>
            </Box>
        );
    }
}