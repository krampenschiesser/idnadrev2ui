import * as React from 'react';
import {Tag} from "antd";
import {TagProps} from "antd/lib/tag";

export interface TagItemProps extends TagProps {
  tag: string
  onClose: (tag: string) => void;
}

export class TagItem extends React.Component<TagItemProps, object> {
  render() {
    return (
      <Tag closable={true} onClose={this.props.onClose}>{this.props.tag}</Tag>
    );
  }
}