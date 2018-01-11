import * as React from 'react';
import {observer} from 'mobx-react';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import {FormComponentProps} from 'antd/lib/form';
import {TaskFilter} from '../../store/TaskFilter';

export interface TaskFilterProps extends FormComponentProps {
    filter: TaskFilter;
    reload: Function
    // store: GlobalStore
}

class NameFilter extends React.Component<TaskFilterProps, object> {
    onChange = (text: React.ChangeEvent<HTMLInputElement>) => {
        let value = text.target.value;
        if (value) {
            this.props.filter.name = value;
        } else {
            this.props.filter.name = undefined;
        }
        this.props.reload();//fixme reload after timeout after last modification
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <FormItem label="Name" colon={true}>
                {getFieldDecorator('name', {
                    rules: [{
                        type: 'string', message: 'The input is no valid string',
                    }],
                })(
                    <Input value={name} onChange={this.onChange}/>
                )}
            </FormItem>
        );
    }
}


@observer
class TaskFilterViewForm extends React.Component<TaskFilterProps, object> {
    render() {
        return (
            <Form layout='inline'>
                <NameFilter {...this.props}/>
            </Form>
        );
    }
}

export const TaskFilterView = Form.create()(TaskFilterViewForm);
