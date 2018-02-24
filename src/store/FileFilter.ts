import { Tag } from '../dto/Tag';
import { FileType } from '../dto/FileType';
import { RepositoryId } from '../dto/RepositoryId';

export default interface FileFilter {
  name?: string;
  content?: string;

  tags?: Tag[];
  types?: FileType[];
  repository?: RepositoryId;
}