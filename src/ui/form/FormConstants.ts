import {ColProps} from 'antd/lib/grid/col';

interface DefaultFormItemProps {
    labelCol: ColProps
    wrapperCol: ColProps
}

class FormConstantsProps {
    labelSpan: number = 1;
    labelOffset: number = 0;
    wrapperSpan: number = 8;
    wrapperOffset: number = 0;
    buttonOffset: number = 4;

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
}

export const FormConstants = new FormConstantsProps();