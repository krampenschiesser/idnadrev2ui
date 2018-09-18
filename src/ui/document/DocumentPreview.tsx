import * as React from 'react';
import { observer } from 'mobx-react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import GlobalStore from '../../store/GlobalStore';
import TagViewer from '../tag/TagViewer';
import { MarkdownViewer } from '../editor/MarkdownViewer';
import Card from 'antd/lib/card';
import IdnadrevFile from '../../dto/IdnadrevFile';
import BinaryFile from '../../dto/BinaryFile';
import BinaryFilePreview from '../file/BinaryFilePreview';

export interface DocumentPreviewProps {
  file?: IdnadrevFile<{}, {}>;
  store: GlobalStore;
}

@observer
export default class DocumentPreview extends React.Component<DocumentPreviewProps, object> {
  render() {
    const file = this.props.file;

    if (file) {
      let title = (
        <div>
          <Row>
            <Col span={12}>
              <h2>{file.name}</h2>
            </Col>
            <Col style={{marginTop: 10, textAlign: 'right'}} span={12}>
              <span>{file.updated.toLocaleDateString() + '   ' + file.updated.toLocaleTimeString()}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <TagViewer store={this.props.store} item={file}/>
            </Col>
          </Row>
        </div>
      );

      let content = <p>No content available</p>;
      if (typeof file.content === 'string') {
        content = <MarkdownViewer text={file.content}/>;
      } else if (file instanceof BinaryFile) {
        content = <BinaryFilePreview file={file}/>;
      }
      return (
        <Card title={title}>
          {content}
        </Card>
      );
    } else {
      return <div/>;
    }
  }
}
