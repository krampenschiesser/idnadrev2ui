import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';

export default class Document extends IdnadrevFile<string, string> {
  constructor(name: string, tags: Tag[] = [], content: string = '') {
    super(name, FileType.Document);
    this.tags = tags;
    this.content = content;
  }

}