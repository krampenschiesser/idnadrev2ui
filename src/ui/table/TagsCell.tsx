import * as React from 'react';
import { Tag as FileTag } from '../../dto/Tag';
import IdnadrevFile from '../../dto/IdnadrevFile';
import Tag from 'antd/lib/tag';

export function tagsCell(tags: FileTag[], record: IdnadrevFile<{}, {}>, index: number): React.ReactNode {
  let rendered = tags.map(t => <Tag key={t.name}>{t.name}</Tag>);
  return <div>{rendered}</div>;
}