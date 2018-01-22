import { ColProps } from 'antd/lib/grid/col';

interface DefaultFormItemProps {
  labelCol: ColProps;
  wrapperCol: ColProps;
}

class FormConstantsProps {
  labelSpan: number = 3;
  labelOffset: number = 0;
  wrapperSpan: number = 21;
  wrapperOffset: number = 0;
  buttonOffset: number = 12;

  getItemProps(): DefaultFormItemProps {
    return {
      labelCol: {
        span: this.labelSpan,
        offset: this.labelOffset
      },
      wrapperCol: {
        span: this.wrapperSpan,
        offset: this.wrapperOffset
      }
    };
  }

  getHalfItemProps(indent?: number): DefaultFormItemProps {
    if (indent === undefined) {
      indent = 6;
    }
    return {
      labelCol: {
        span: indent,
        offset: this.labelOffset
      },
      wrapperCol: {
        span: 24 - indent,
        offset: this.wrapperOffset
      }
    };
  }
}

export const FormConstants = new FormConstantsProps();