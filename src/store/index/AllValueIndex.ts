import Index from './Index';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { FileType } from '../../dto/FileType';
import { RepositoryId } from '../../dto/RepositoryId';
import { FileId } from '../../dto/FileId';

export default class AllValueIndex<V> implements Index {
  field: string;
  values: Map<V | null, Set<FileId>> = new Map<V | null, Set<FileId>>();
  inverse: Map<FileId, V | null> = new Map<FileId, V | null>();
  type: FileType;

  constructor(repo: RepositoryId, field: string, type: FileType) {
    this.field = field;
    this.type = type;
  }

  onUpdate(file: IdnadrevFile<any, any>): void {
    if (file.fileType === this.type) {
      let existing = this.inverse.get(file.id);
      let fieldValue = file[this.field];

      fieldValue = typeof fieldValue === 'string' ? fieldValue.toLocaleLowerCase() : fieldValue;
      if (existing && existing !== fieldValue) {
        let set = this.values.get(existing);
        if (set) {
          set.delete(file.id);
        }
      }
      let value = this.values.get(null);
      if (!value) {
        value = new Set<FileId>();
        this.values.set(null, value);
      }
      value.add(file.id);
      this.inverse.set(file.id, fieldValue);
    }
  }

  onDelete(file: IdnadrevFile<any, any>): void {
    if (file.fileType === this.type) {
      let existing = this.inverse.get(file.id);
      let fieldValue = file[this.field];

      fieldValue = typeof fieldValue === 'string' ? fieldValue.toLocaleLowerCase() : fieldValue;
      if (existing && existing !== fieldValue) {
        let set = this.values.get(existing);
        if (set) {
          set.delete(file.id);
        }
      }
      let value = this.values.get(null);
      if (value) {
        value.delete(file.id);
      }
      this.inverse.delete(file.id);
    }
  }

  getAllValues(): Set<V | null> {
    return new Set<V | null>(Array.from(this.values.keys()));
  }

  getIds(key: V | null): Set<FileId> {
    let set = this.values.get(key);
    if (!set) {
      return new Set();
    } else {
      return set;
    }
  }
}