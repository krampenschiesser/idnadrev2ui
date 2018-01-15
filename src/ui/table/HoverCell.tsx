import * as React from 'react';
import { observer } from 'mobx-react';

export interface HoverCellProps {
  onHover: Function;
  // onHover: () => {}
}

@observer
export default class HoverCell extends React.Component<HoverCellProps, object> {
  // tslint:disable-next-line
  onRef = (span: any) => {
    if (!span || !span.parentNode || !span.parentNode.parentNode) {
      return;
    }
    let tr = span.parentNode.parentNode;
    tr.onmouseenter = () => {
      this.props.onHover();
    };
  };

  render() {
    return <div ref={this.onRef}>{this.props.children}</div>;
  }
}
