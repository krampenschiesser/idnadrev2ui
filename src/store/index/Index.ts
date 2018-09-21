import IdnadrevFile from '../../dto/IdnadrevFile';
import { RepositoryId } from '../../dto/RepositoryId';
import { FileId } from '../../dto/FileId';
import { FileType } from '../../dto/FileType';
import AllValueIndex from './AllValueIndex';

export enum IndexType {
  ALL_VALUE
}

export enum IndexUpdateState {
  CHANGED, UNCHANGED
}

export default abstract class Index {
  repo: RepositoryId;
  id: FileId;
  type?: FileType;


  constructor(repo: RepositoryId, id: FileId, type?: FileType) {
    this.repo = repo;
    this.id = id;
    this.type = type;
  }

  abstract onUpdate(file: IdnadrevFile<any, any>): IndexUpdateState;

  abstract onDelete(file: IdnadrevFile<any, any>): IndexUpdateState;

  abstract toJson(): string;

  abstract getType(): IndexType;
}

export function indexFromJson(type: IndexType, json: string): Index {
  if (type === IndexType.ALL_VALUE) {
    return AllValueIndex.fromJson(json);
  } else {
    throw 'unkown index type' + type;
  }
}