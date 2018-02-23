import * as React from 'react';
import { observer } from 'mobx-react';
import BinaryFile from '../../dto/BinaryFile';

export interface BinaryFilePreviewProps {
  file?: BinaryFile;
}

@observer
export default class BinaryFilePreview extends React.Component<BinaryFilePreviewProps, object> {
  render() {
    const file = this.props.file;

    if (file) {
      let mimeType = file.details.mimeType;
      if (mimeType && mimeType.indexOf('image') >= 0) {
        let blob = new Blob([file.content.buffer], {type: mimeType});
        let url = window.URL.createObjectURL(blob);
        return (
          <img src={url}/>
        );
      } else if (mimeType && this.isText(mimeType)) {
        let text = new TextDecoder('utf-8').decode(file.content);
        return (
          <p>
            {text}
          </p>
        );
      }
    }
    return (
      <p>Content not displayable</p>
    );
  }

  private isText(mimeType: string): boolean {
    return mimeType.indexOf('text') >= 0;
  }

  // private isCode(mimeType: string): boolean {
  //   return mimeType.indexOf('application/json') >= 0;
  // }
}
