import * as React from 'react';
import {FormComponentProps} from 'antd/lib/form';
import {observer} from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import {MarkdownEditor} from '../editor/MarkdownEditor';
import IdnadrevFile from '../../dto/IdnadrevFile';
import {FormConstants} from './FormConstants';

export interface MarkdownFormItemProps extends FormComponentProps {
    name?: string;
    item: IdnadrevFile<any, string>;
}

@observer
export default class MarkdownFormItem extends React.Component<MarkdownFormItemProps, object> {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <FormItem {...FormConstants.getItemProps()} label="Content" colon={true}>
                {getFieldDecorator('content', {
                    rules: [{
                        type: 'string', message: 'The input is no valid string',
                    }],
                })(
                    <MarkdownEditor item={this.props.item}/>
                )}
            </FormItem>
        );
    }
}

