import AllValueIndex, { TagIndex } from './AllValueIndex';
import { RepositoryId } from '../dto/RepositoryId';
import { FileId } from '../dto/FileId';
import { FileType } from '../dto/FileType';
import IdnadrevFile from '../dto/IdnadrevFile';

export enum IndexType {
  ALL_VALUES, ALL_TAG
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