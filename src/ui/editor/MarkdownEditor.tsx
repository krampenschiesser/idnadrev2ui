import * as React from 'react';
import { observer } from 'mobx-react';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './MarkdownEditor.css';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/theme/ttcn.css');

require('codemirror/mode/gfm/gfm');
require('codemirror/mode/javascript/javascript');

export interface MarkdownEditorProps {
  item: IdnadrevFile<{}, string>;
}

@observer
export class MarkdownEditor extends React.Component<MarkdownEditorProps, object> {
  text: string;

  constructor(props: MarkdownEditorProps) {
    super(props);
    this.text = props.item.content;
  }

  onTextChange = (edited: string) => {
    this.props.item.content = edited;
  };

  render() {
    return (
      <div>
        <CodeMirror
          className='MarkdownEditor'
          value={this.props.item.content}
          options={{
            mode: 'gfm',
            theme: 'ttcn',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            this.onTextChange(value);
          }}
        />
      </div>
    );
  }
}