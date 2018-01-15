import * as React from 'react';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { GlobalStore } from '../../store/GlobalStore';
import { FormComponentProps } from 'antd/lib/form';
import { FormConstants } from './FormConstants';
import RepositorySelector from '../RepositorySelector';

export interface RepositoryFormItemProps extends FormComponentProps {
  file: IdnadrevFile<{}, {}>;
  store: GlobalStore;
}

@observer
export default class RepositoryFormItem extends React.Component<RepositoryFormItemProps, object> {
  render() {
    return (
      <FormItem {...FormConstants.getItemProps()} label='Repository' colon={true}>
        <RepositorySelector {...this.props} />
      </FormItem>
    );
  }
}