import { ColProps } from 'antd/lib/grid/col';

interface DefaultFormItemProps {
  labelCol: ColProps;
  wrapperCol: ColProps;
}

class FormConstantsProps {
  labelSpan: number = 3;
  labelOffset: number = 0;
  wrapperSpan: number = 24;
  wrapperOffset: number = 0;
  buttonOffset: number = 12;

  getItemProps(indent?: number): DefaultFormItemProps {
    if (indent === undefined) {
      indent = 3;
    }
    return {
      labelCol: {
        span: indent,
        offset: this.labelOffset
      },
      wrapperCol: {
        span: this.wrapperSpan - indent,
        offset: this.wrapperOffset
      }
    };
  }

  getHalfItemProps(indent?: number): DefaultFormItemProps {
    return this.getItemProps(6);
  }
}

export const FormConstants = new FormConstantsProps();