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
                    <Input onChange={this.onChange}/>
                )}
            </FormItem>
        );
    }
}


@observer
class TaskFilterViewForm extends React.Component<TaskFilterProps, object> {
    lastEdit: number;

    reload = () => {
        const timeout = 80;
        this.lastEdit = new Date().getTime();
        setTimeout(() => {
            let now = new Date().getTime();
            if (now -this.lastEdit >= timeout) {
                console.log("reloading")
                this.props.reload();
            } else {
                console.log("not reloading",now -this.lastEdit )
            }
        }, timeout);
    };

    render() {
        return (
            <Form layout='inline'>
                <NameFilter form={this.props.form} filter={this.props.filter} reload={this.reload}/>
            </Form>
        );
    }
}

export const TaskFilterView = Form.create()(TaskFilterViewForm);
