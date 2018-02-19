import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';

export interface BinaryFileDetails {
  originalFileName: string;
}

export default class BinaryFile extends IdnadrevFile<BinaryFileDetails, Uint8Array> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.Binary);
    this.tags = tags;
  }
}