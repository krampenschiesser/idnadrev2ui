import * as React from 'react';
import { observer } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

export interface MarkdownViewerProps {
  text: string;
}

@observer
export class MarkdownViewer extends React.Component<MarkdownViewerProps, object> {
  render() {
    return (
      <ReactMarkdown source={this.props.text}/>
    );
  }
}