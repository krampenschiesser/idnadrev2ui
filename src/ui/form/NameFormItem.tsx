import * as React from 'react';
import { Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormConstants } from './FormConstants';
import IdnadrevFile from '../../dto/IdnadrevFile';

export interface NameFormItemProps extends FormComponentProps {
  file: IdnadrevFile<{}, {}>;
}

@observer
export default class NameFormItem extends React.Component<NameFormItemProps, object> {
  name: string;

  componentDidMount() {
    this.name = this.props.file.name;
  }

  onChange = (text: React.ChangeEvent<HTMLInputElement>) => {
    let value = text.target.value;
    if (value) {
      this.props.file.name = value;
      // this.props.onChange(value);
    } else {
      this.props.file.name = '';
      // this.props.onChange('');
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...FormConstants.getItemProps()} label='Name' colon={true}>
        {getFieldDecorator('name', {
          rules: [{
            type: 'string', message: 'The input is no valid string',
          }, {
            required: true, message: 'A name is required',
          }],
        })(
          <Input value={name} onChange={this.onChange}/>
        )}
      </FormItem>
    );
  }
}