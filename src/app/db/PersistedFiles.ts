import { RepositoryId } from '../dto/RepositoryId';
import { FileId } from '../dto/FileId';
import { FileType } from '../dto/FileType';
import { EncryptedData, Nonce } from '../crypto/CryptoHelper';
import { IndexType } from './Index';

export interface PersistedIdnadrevFile {
  data: EncryptedData;
  nonce: Nonce;
  id: FileId;
  repositoryId: RepositoryId
  type: FileType;
  deleted: boolean;
}

export interface PersistedBinaryFile extends PersistedIdnadrevFile {
  dataBinary: EncryptedData;
  nonceBinary: Nonce;
}

export interface PersistedRepository {
  id: FileId;
  name: string;
  data: EncryptedData;
  salt: Uint32Array;
  nonce: Nonce;
}

export interface PersistedIndex {
  id: FileId;
  repositoryId: RepositoryId;
  data: EncryptedData;
  nonce: Nonce;
  type: IndexType;
}
