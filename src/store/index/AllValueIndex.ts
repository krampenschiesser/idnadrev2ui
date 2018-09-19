import {FileId} from '../../dto/FileId';
import {FileType} from '../../dto/FileType';
import IdnadrevFile from '../../dto/IdnadrevFile';
import {RepositoryId} from '../../dto/RepositoryId';
import Index from './Index';

export default class AllValueIndex<V> implements Index {
    field: string;
    values: Map<V | undefined, Set<FileId>> = new Map<V | undefined, Set<FileId>>();
    inverse: Map<FileId, V | undefined> = new Map<FileId, V | undefined>();
    type: FileType;

    constructor(repo: RepositoryId, field: string, type: FileType) {
        this.field = field;
        this.type = type;
    }

    removeExisting(id: FileId, value: V) {
        let existing = this.inverse.get(id);
        if (existing !== undefined && existing !== value) {
            let set = this.values.get(existing);
            if (set) {
                set.delete(id);
                if(set.size===0) {
                    this.values.delete(existing);
                }
            }
        }
    }

    onUpdate(file: IdnadrevFile<any, any>): void {
        if (file.fileType === this.type) {
            let fieldValue = file[this.field];

            fieldValue = typeof fieldValue === 'string' ? fieldValue.toLocaleLowerCase() : fieldValue;
            this.removeExisting(file.id,fieldValue);
            let set = this.values.get(fieldValue);
            if (!set) {
                set = new Set<FileId>();
                this.values.set(fieldValue, set);
            }
            set.add(file.id);
            this.inverse.set(file.id, fieldValue);
        }
    }

    onDelete(file: IdnadrevFile<any, any>): void {
        if (file.fileType === this.type) {
            let fieldValue = file[this.field];

            fieldValue = typeof fieldValue === 'string' ? fieldValue.toLocaleLowerCase() : fieldValue;
            this.removeExisting(file.id,fieldValue);
            let value = this.values.get(fieldValue);
            if (value) {
                value.delete(file.id);
                if(value.size===0) {
                    this.values.delete(fieldValue);
                }
            }
            this.inverse.delete(file.id);
        }
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
}