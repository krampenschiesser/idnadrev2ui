import * as React from 'react';
import { observer } from 'mobx-react';
import IdnadrevFile from '../../dto/IdnadrevFile';
import './MarkdownEditor.css';

let CodeMirror: any = undefined;

if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  CodeMirror = require("./CodeMirrorWrapper");
}


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
    let editor = undefined;
    if (CodeMirror) {
      editor = (
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
      );
    } else {
      editor = (
        <textarea onChange={e => this.onTextChange(e.target.value)}>{this.props.item.content}</textarea>
      );
    }
    return (
      <div>
        {editor}
      </div>
    );
  }
}