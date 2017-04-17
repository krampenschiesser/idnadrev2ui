/**
 * Created by scar on 4/14/17.
 */

import React, {Component} from "react"
import {Box, Button} from "grommet";

export default class  extends Component {
    render() {
        const {align, form, onClick, ...props} = this.props;
        const valid = form.isValid;
        return (
            <Box align={align || "center"} flex={true}>
                <Button
                    {...props}
                    label="Submit" type="submit"
                    primary={true} fill={false}
                    onClick={valid ? (onClick || form.submit()) : null}/>
            </Box>
        );
    }
}