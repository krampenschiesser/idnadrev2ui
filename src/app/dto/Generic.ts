import IdnadrevFile from './IdnadrevFile';
import { FileType } from './FileType';

export default class Generic extends IdnadrevFile<any, any> {
  constructor(name: string) {
    super(name, FileType.Generic);
  }
}