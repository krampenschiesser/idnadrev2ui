import * as React from 'react';
// import {Tag, Icon, AutoComplete} from "antd";
// import {observable} from "mobx";
// import {GlobalStore} from "../../store/GlobalStore";
import {observer} from "mobx-react";
import IdnadrevFile from "../../dto/IdnadrevFile";
import ReactMarkdown from "react-markdown";

export interface MarkdownEditorProps {
    item: IdnadrevFile<any, string>;
}

@observer
export class MarkdownEditor extends React.Component<MarkdownEditorProps, object> {

    render() {
        let content = this.props.item.content;
        return (
            <div>
                <ReactMarkdown source={content} />,
            </div>
        );
    }
}