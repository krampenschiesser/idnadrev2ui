import { v4 as uuid } from 'uuid';
import Index, { IndexType, IndexUpdateState } from './Index';
import { FileId } from '../dto/FileId';
import { RepositoryId } from '../dto/RepositoryId';
import { FileType } from '../dto/FileType';
import IdnadrevFile from '../dto/IdnadrevFile';
import { Tag } from '../dto/Tag';

export default class AllValueIndex<V> extends Index {
  field: string;
  values: Map<{} | undefined, Set<FileId>> = new Map<{} | undefined, Set<FileId>>();
  inverse: Map<FileId, Set<V | undefined>> = new Map<FileId, Set<V | undefined>>();

  constructor(repo: RepositoryId, field: string, type?: FileType, id?: FileId) {
    super(repo, !id ? uuid() : id, type);
    this.field = field;
  }

  static fromJson<V>(json: string): AllValueIndex<V> {
    const parsed: JsonConversion = JSON.parse(json);
    const allValueIndex = new AllValueIndex<V>(parsed.repo, parsed.field, parsed.type, parsed.id);

    parsed.inverse.forEach(entry => {
      const key = entry[0];
      const setAsArray = entry[1];
      const set = new Set<V>(setAsArray);
      allValueIndex.inverse.set(key, set);
    });
    parsed.values.forEach(entry => {
      const key = entry[0];
      const setAsArray = entry[1];
      const set = new Set<FileId>(setAsArray);
      allValueIndex.values.set(key, set);
    });

    return allValueIndex;
  }

  removeExisting(id: FileId, value: V) {
    const existing = this.inverse.get(id);
    if (existing !== undefined && !existing.has(value)) {
      for (let it = existing.values(), e = null; e = it.next().value;) {
        const set = this.values.get(this.transformKey(e));
        if (set) {
          set.delete(id);
          existing.delete(e);
          if (existing.size === 0) {
            this.inverse.delete(id);
          }
          if (set.size === 0) {
            this.values.delete(this.transformKey(e));
          }
        }
      }
    }
  }

  onUpdate(file: IdnadrevFile<any, any>): IndexUpdateState {
    let retval = IndexUpdateState.UNCHANGED;
    if (!this.type || file.fileType === this.type) {
      let fieldValues: V[];
      const value = this.getValueForKey(this.field, file);
      if (Array.isArray(value)) {
        fieldValues = value;
      } else {
        fieldValues = [value];
      }
      for (const fieldValue of fieldValues) {
        this.removeExisting(file.id, fieldValue);
      }
      for (const fieldValue of fieldValues) {
        let set = this.values.get(this.transformKey(fieldValue));
        if (!set) {
          set = new Set<FileId>();
          this.values.set(this.transformKey(fieldValue), set);
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
      const value = this.getValueForKey(this.field, file);
      if (Array.isArray(value)) {
        fieldValues = value;
      } else {
        fieldValues = [value];
      }
      for (const fieldValue of fieldValues) {
        this.removeExisting(file.id, fieldValue);
        const curValue = this.values.get(this.transformKey(fieldValue));
        if (curValue) {
          curValue.delete(file.id);
          if (curValue.size === 0) {
            this.values.delete(this.transformKey(fieldValue));
            retval = IndexUpdateState.CHANGED;
          }
        }
        const existingSet = this.inverse.get(file.id);
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
    const set = new Set<V | undefined>();
    const from: Set<V | undefined>[] = Array.from(this.inverse.values());
    for (const curSet of from) {
      curSet.forEach(v => {
        set.add(v);
      });
    }
    return set;
  }

  getIds(key: V | undefined): Set<FileId> {
    const set = this.values.get(this.transformKey(key));
    if (!set) {
      return new Set();
    } else {
      return new Set(set);
    }
  }

  protected transformKey(key: V | undefined): {} | undefined {
    return key;
  }


  toJson(): string {
    const obj: JsonConversion = {
      id: this.id,
      repo: this.repo,
      type: this.type,
      inverse: Array.from(this.inverse.entries()).map((v: any[]) => {
        v[1] = Array.from(v[1]);
        return v;
      }),
      values: Array.from(this.values.entries()).map((v: any[]) => {
        v[1] = Array.from(v[1]);
        return v;
      }),
      field: this.field
    };
    const json = JSON.stringify(obj);
    return json;
  }

  getType(): IndexType {
    return IndexType.ALL_VALUES;
  }
}

interface JsonConversion {
  id: FileId;
  repo: RepositoryId;
  field: string;
  type?: FileType;
  inverse: any[];
  values: any[];
}

export class TagIndex extends AllValueIndex<Tag> {

  constructor(repo: RepositoryId, id?: FileId) {
    super(repo, 'tags', undefined, id);
  }

  static tagsFromJson(json: string): TagIndex {
    const parsed: JsonConversion = JSON.parse(json);
    const tagIndex = new TagIndex(parsed.repo, parsed.id);

    parsed.inverse.forEach(entry => {
      const key = entry[0];
      const setAsArray = entry[1];

      const set = new Set<Tag>();
      for (const e of setAsArray) {
        const tag = new Tag(e.name);
        set.add(tag);
      }
      tagIndex.inverse.set(key, set);
    });
    parsed.values.forEach(entry => {
      const key = entry[0];
      const setAsArray = entry[1];
      const set = new Set<FileId>(setAsArray);
      tagIndex.values.set(key, set);
    });

    return tagIndex;
  }

  transformKey(key: Tag): {} {
    return JSON.stringify(key);
  }


  getType(): IndexType {
    return IndexType.ALL_TAG;
  }
}
