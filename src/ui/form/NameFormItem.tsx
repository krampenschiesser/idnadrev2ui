import * as React from 'react';
import {Form, Input} from "antd";
import {FormComponentProps} from 'antd/lib/form';
import {observer} from "mobx-react";

const FormItem = Form.Item;

export interface NameFormItemProps extends FormComponentProps {
    name?: string;
}

@observer
export default class NameFormItem extends React.Component<NameFormItemProps, object> {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <FormItem label="name">
                {getFieldDecorator('name', {
                    rules: [{
                        type: 'string', message: 'The input is no valid string',
                    }, {
                        required: true, message: 'A name is required',
                    }],
                })(
                    <Input value={this.props.name}/>
                )}
            </FormItem>
        );
    }
}

