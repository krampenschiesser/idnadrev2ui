import * as React from 'react';
// import {Tag, Icon, AutoComplete} from "antd";
// import {observable} from "mobx";
// import {GlobalStore} from "../../store/GlobalStore";
import {observer} from 'mobx-react';
import IdnadrevFile from '../../dto/IdnadrevFile';
import ReactMarkdown from 'react-markdown';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import './MarkdownEditor.css';
import {observable} from 'mobx';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/theme/ttcn.css');

require('codemirror/mode/gfm/gfm');
require('codemirror/mode/javascript/javascript');

export interface MarkdownEditorProps {
    item: IdnadrevFile<any, string>;
}

@observer
export class MarkdownEditor extends React.Component<MarkdownEditorProps, object> {
    @observable text: string;


    constructor(props: MarkdownEditorProps, context: any) {
        super(props, context);
        this.text = props.item.content;
    }

    onTextChange = (edited: string) => {
        this.text = edited;
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
                        this.text = value;
                    }}
                />

                <ReactMarkdown source={this.text} />
            </div>
        );
    }
}