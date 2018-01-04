import * as React from 'react';
import {Form} from "antd";
// import {Form, Input} from "antd";
import {FormComponentProps} from 'antd/lib/form';
import {inject, observer} from "mobx-react";
import NameFormItem from "../form/NameFormItem";
import TagFormItem from "../form/TagFormItem";
import {GlobalStore} from "../../store/GlobalStore";
import {observable} from "mobx";
import Thought from "../../dto/Thought";

// const FormItem = Form.Item;

export interface AddThoughtProps extends FormComponentProps {
    children: any;
    thought?: Thought
    store: GlobalStore
}

@observer
@inject("store")
class AddThoughtForm extends React.Component<AddThoughtProps, object> {
    @observable thought: Thought;

    componentWillMount() {
        this.thought = new Thought('');
    }

    render() {

        // const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <NameFormItem form={this.props.form}/>
                <TagFormItem form={this.props.form} store={this.props.store} file={this.thought} />
            </Form>
        );
    }
}

export const AddThought = Form.create()(AddThoughtForm);
