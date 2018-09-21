import { FileId } from '../../dto/FileId';
import { FileType } from '../../dto/FileType';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { RepositoryId } from '../../dto/RepositoryId';
import Index, { IndexType, IndexUpdateState } from './Index';
import { v4 as uuid } from 'uuid';

export default class AllValueIndex<V> extends Index {
  field: string;
  values: Map<V | undefined, Set<FileId>> = new Map<V | undefined, Set<FileId>>();
  inverse: Map<FileId, Set<V | undefined>> = new Map<FileId, Set<V | undefined>>();

  constructor(repo: RepositoryId, field: string, type?: FileType, id?: FileId) {
    super(repo, !id ? uuid() : id, type);
    this.field = field;
  }

  removeExisting(id: FileId, value: V) {
    let existing = this.inverse.get(id);
    if (existing !== undefined && !existing.has(value)) {
      for (var it = existing.values(), e = null; e = it.next().value;) {
        let set = this.values.get(e);
        if (set) {
          set.delete(id);
          existing.delete(e);
          if (existing.size === 0) {
            this.inverse.delete(id);
          }
          if (set.size === 0) {
            this.values.delete(e);
          }
        }
      }
    }
  }

  onUpdate(file: IdnadrevFile<any, any>): IndexUpdateState {
    let retval = IndexUpdateState.UNCHANGED;
    if (!this.type || file.fileType === this.type) {
      let fieldValues: V[];
      let value = this.getValueForKey(this.field, file);
      if (Array.isArray(value)) {
        fieldValues = value;
      } else {
        fieldValues = [value];
      }
      for (let fieldValue of fieldValues) {
        this.removeExisting(file.id, fieldValue);
      }
      for (let fieldValue of fieldValues) {
        let set = this.values.get(fieldValue);
        if (!set) {
          set = new Set<FileId>();
          this.values.set(fieldValue, set);
        }
        set.add(file.id);
        let existingSet = this.inverse.get(file.id);
        if (!existingSet) {
          existingSet = new Set();
          this.inverse.set(file.id, existingSet);
        }
        existingSet.add(fieldValue);
        retval = IndexUpdateState.CHANGED;
      }
    }
    return retval;
  }

  getValueForKey(key: string, obj: IdnadrevFile<any, any>): V {
    return key.split('.').reduce((currentObject, pathName) => {
      return currentObject && currentObject[pathName];
    }, obj);
  }

  onDelete(file: IdnadrevFile<any, any>): IndexUpdateState {
    let retval = IndexUpdateState.UNCHANGED;
    if (!this.type || file.fileType === this.type) {
      let fieldValues: V[];
      let value = this.getValueForKey(this.field, file);
      if (Array.isArray(value)) {
        fieldValues = value;
      } else {
        fieldValues = [value];
      }
      for (let fieldValue of fieldValues) {
        this.removeExisting(file.id, fieldValue);
        let value = this.values.get(fieldValue);
        if (value) {
          value.delete(file.id);
          if (value.size === 0) {
            this.values.delete(fieldValue);
            retval = IndexUpdateState.CHANGED;
          }
        }
        let existingSet = this.inverse.get(file.id);
        if (existingSet) {
          existingSet.delete(fieldValue);
          if (existingSet.size === 0) {
            this.inverse.delete(file.id);
            retval = IndexUpdateState.CHANGED;
          }
        }
      }
    }
    return retval;
  }

  getAllValues(): Set<V | undefined> {
    return new Set<V | undefined>(Array.from(this.values.keys()));
  }

  getIds(key: V | undefined): Set<FileId> {
    let set = this.values.get(key);
    if (!set) {
      return new Set();
    } else {
      return set;
    }
  }


  toJson(): string {
    let obj: JsonConversion = {
      id: this.id,
      repo: this.repo,
      type: this.type,
      inverse: Array.from(this.inverse.entries()).map(v => {
        v[1] = Array.from(v[1]);
        return v;
      }),
      values: Array.from(this.values.entries()).map(v => {
        v[1] = Array.from(v[1]);
        return v;
      })
    };
    return JSON.stringify(obj);
  }

  static fromJson<V>(json: string): AllValueIndex<V> {
    let parsed: JsonConversion = JSON.parse(json);
    let allValueIndex = new AllValueIndex<V>(parsed.repo, parsed.field, parsed.type, parsed.id);

    parsed.inverse.forEach(entry => {
      let key = entry[0];
      let setAsArray = entry[1];
      let set = new Set<V>(setAsArray);
      allValueIndex.inverse.set(key, set);
    });
    parsed.values.forEach(entry => {
      let key = entry[0];
      let setAsArray = entry[1];
      let set = new Set<FileId>(setAsArray);
      allValueIndex.values.set(key, set);
    });

    return allValueIndex;
  }

  getType(): IndexType {
    return IndexType.ALL_VALUE;
  }
}

interface JsonConversion {
  id: FileId,
  repo: RepositoryId,
  type?: FileType,
  inverse: [],
  values: []
}