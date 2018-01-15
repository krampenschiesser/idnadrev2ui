import * as React from 'react';
// import {FormComponentProps} from 'antd/lib/form';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import IdnadrevFile from '../../dto/IdnadrevFile';
import TagContainer from '../tag/TagContainer';
import { GlobalStore } from '../../store/GlobalStore';
import { FormComponentProps } from 'antd/lib/form';
import { FormConstants } from './FormConstants';

export interface TagFormItemProps extends FormComponentProps {
  file: IdnadrevFile<{}, {}>;
  store: GlobalStore;
}

@observer
export default class TagFormItem extends React.Component<TagFormItemProps, object> {
  render() {
    return (
      <FormItem {...FormConstants.getItemProps()} label='Tags' colon={true}>
        <TagContainer item={this.props.file} store={this.props.store}/>
      </FormItem>
    );
  }
}