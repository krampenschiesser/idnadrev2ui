import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';
import { observable } from 'mobx';

export class BinaryFileDetails {
  @observable originalFileName?: string;
  @observable  mimeType?: string;
}

export default class BinaryFile extends IdnadrevFile<BinaryFileDetails, Uint8Array> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.Binary);
    this.tags = tags;
    this.details = new BinaryFileDetails();
  }
}