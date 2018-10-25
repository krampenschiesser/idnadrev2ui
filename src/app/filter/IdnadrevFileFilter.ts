import { Tag } from '../dto/Tag';
import { FileType } from '../dto/FileType';
import IdnadrevFile from '../dto/IdnadrevFile';

export default interface IdnadrevFileFilter {
  name?: string;
  content?: string;
  tags: Tag[];
  type?: FileType;
}

export function filterFiles<T extends IdnadrevFile<any, any>, F extends IdnadrevFileFilter>(files: T[], filter: F, predicate?: (f: T) => boolean): T[] {
  return files.filter(f => {
    let valid = true;
    if (filter.type) {
      valid = f.fileType === filter.type;
    }
    if (filter.name) {
      valid = valid && f.name.toLocaleLowerCase().includes(filter.name.toLocaleLowerCase());
    }
    if (filter.content) {
      valid = valid && f.content.toLocaleLowerCase().includes(filter.content.toLocaleLowerCase());
    }
    if (filter.tags && filter.tags.length > 0) {
      let tagsContainedInThought = f.tags.filter(tag => filter.tags.find(ft => ft.name === tag.name));
      if (tagsContainedInThought.length !== filter.tags.length) {
        valid = false;
      }
    }
    if (predicate) {
      valid = valid && predicate(f);
    }
    return valid;
  });
}