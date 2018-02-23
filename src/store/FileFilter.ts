import { Tag } from '../dto/Tag';
import { FileType } from '../dto/FileType';

export default interface FileFilter {
  name?: string;
  content?: string;

  tags?: Tag[];
  types?: FileType[];
}