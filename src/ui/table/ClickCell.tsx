import * as React from 'react';
import { observer } from 'mobx-react';

export interface ClickCellProps {
  onClick: () => void;
  // onHover: () => {}
}

@observer
export default class ClickCell extends React.Component<ClickCellProps, object> {
  // tslint:disable-next-line
  onRef = (span: any) => {
    if (!span || !span.parentNode || !span.parentNode.parentNode) {
      return;
    }
    let tr = span.parentNode.parentNode;
    tr.onclick = () => {
      this.props.onClick();
    };
    tr.style = 'cursor: pointer';
    console.log(tr);
  };

  render() {
    return <div ref={this.onRef}>{this.props.children}</div>;
  }
}
