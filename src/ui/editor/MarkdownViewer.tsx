import * as React from 'react';
import { observer } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/theme/ttcn.css');

require('codemirror/mode/gfm/gfm');
require('codemirror/mode/javascript/javascript');

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