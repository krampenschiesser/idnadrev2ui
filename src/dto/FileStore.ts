import { observable } from 'mobx';

export enum FileStoreType {
  LOCAL,
  REMOTE_FILE,
  GOOGLE_DRIVE,
  DROPBOX
}

export default class FileStore {
  @observable type: FileStoreType;
  @observable name: string;
}

export class LocalStore extends FileStore{
}

export class RemoteFileStore extends FileStore{
  url: string;
  id: string;
}