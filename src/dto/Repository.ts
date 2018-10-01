import { observable } from 'mobx';
import { RepositoryId } from './RepositoryId';
import { RepositoryToken } from './RepositoryToken';
import { decrypt, decryptToUtf8, encrypt, EncryptedData, encryptSync, fillRandomValues, fromHex, hashSync, Nonce, toHex32, toHex8 } from '../store/CryptoHelper';
import uuid from 'uuid';
import Index from '../store/index/Index';
import AllValueIndex, { TagIndex } from '../store/index/AllValueIndex';
import { Tag } from './Tag';
import { FileType } from './FileType';

export default class Repository {
  id: RepositoryId;
  @observable name: string;
  @observable token?: RepositoryToken;
  salt: Uint32Array = new Uint32Array(32);
  nonce: Nonce;
  data: Uint8Array;

  tagIndex?: TagIndex;
  contextIndex?: AllValueIndex<string>;
  nameIndex?: AllValueIndex<string>;
  finishedTaskIndex?: AllValueIndex<boolean>;
  deletedIndex?: AllValueIndex<boolean>;

  constructor(name: string, pw?: string) {
    this.name = name;
    if (pw) {
      this.id = uuid.v4();

      let encryptionPw = new Uint8Array(32);
      fillRandomValues(encryptionPw);
      this.token = encryptionPw;

      fillRandomValues(this.salt);
      let salty = toHex32(this.salt);
      let hashedPw = hashSync(pw, salty);

      let tuple = encryptSync(encryptionPw, hashedPw);
      this.data = tuple[0];
      this.nonce = tuple[1];

      this.tagIndex = new TagIndex(this.id);
      this.contextIndex = new AllValueIndex<string>(this.id, 'details.context', FileType.Task);
      this.nameIndex = new AllValueIndex<string>(this.id, 'name');
      this.finishedTaskIndex = new AllValueIndex<boolean>(this.id, 'isFinished', FileType.Task);
      this.deletedIndex = new AllValueIndex<boolean>(this.id, 'isDeleted');
    }
  }

  setIndexes(indexes: Index[]) {
    for (let index of indexes) {
      if (index instanceof TagIndex) {
        this.tagIndex = index;
      } else if (index instanceof AllValueIndex) {
        if (index.field === 'details.context') {
          this.contextIndex = index;
        } else if (index.field === 'isFinished') {
          this.finishedTaskIndex = index;
        } else if (index.field === 'name') {
          this.nameIndex = index;
        } else if (index.field === 'isDeleted') {
          this.deletedIndex = index;
        }
      }
    }
  }

  async changePw(old: string, current: string): Promise<boolean> {
    let saltString = toHex32(this.salt);
    let hashedPw = hashSync(old, saltString);
    return decrypt(this.data, this.nonce, hashedPw).then(async token => {
      fillRandomValues(this.salt);
      let salty = toHex32(this.salt);
      let hashedPw = hashSync(current, salty);

      let tuple = await encrypt(token, hashedPw);
      this.data = tuple[0];
      this.nonce = tuple[1];
      return true;
    }).catch(rejected => {
      return false;
    });
  }

  isLocked(): boolean {
    return this.token === undefined;
  }

  isOpen(): boolean {
    return this.token !== undefined;
  }

  encrypt(data: Uint8Array | string): Promise<[EncryptedData, Nonce]> {
    if (this.token) {
      return encrypt(data, this.token);
    } else {
      return new Promise<[EncryptedData, Nonce]>((resolve, reject) => reject('not logged into repository'));
    }
  }

  decryptToText(data: Uint8Array, nonce: Nonce): Promise<string> {
    if (this.token) {
      return decryptToUtf8(data, nonce, this.token);
    } else {
      return new Promise<string>((resolve, reject) => reject('not logged into repository'));
    }
  }

  decrypt(data: Uint8Array, nonce: Nonce): Promise<Uint8Array> {
    if (this.token) {
      return decrypt(data, nonce, this.token);
    } else {
      return new Promise<Uint8Array>((resolve, reject) => reject('not logged into repository'));
    }
  }

  open(pw: string): Promise<void> {
    let saltString = toHex32(this.salt);
    let hashedPw = hashSync(pw, saltString);
    return decrypt(this.data, this.nonce, hashedPw).then(fulfilled => {
      this.token = fulfilled;
      sessionStorage.setItem(this.id, toHex8(hashedPw));
    });
  }

  openWithHash(hash: string): Promise<void> {
    let hashedPw = fromHex(hash);
    return decrypt(this.data, this.nonce, hashedPw).then(fulfilled => {
      this.token = fulfilled;
    });
  }

  get indexesUndefined(): (Index | undefined)[] {
    return [this.tagIndex, this.contextIndex, this.nameIndex, this.finishedTaskIndex, this.deletedIndex];
  }

  get indexes(): Index[] {
    let retval = [];
    let all = [this.tagIndex, this.contextIndex, this.nameIndex, this.finishedTaskIndex, this.deletedIndex];
    for (let index of all) {
      if (!index) {
        throw 'index not initialized, access not allowed';
      } else {
        retval.push(index);
      }
    }
    return retval;
  }

  get getTagIndex(): AllValueIndex<Tag> {
    if (!this.tagIndex) {
      throw 'tag index not defined';
    }
    return this.tagIndex;
  }

  get getContextIndex(): AllValueIndex<string> {
    if (!this.contextIndex) {
      throw 'context index not defined';
    }
    return this.contextIndex;
  }

  get getNameIndex(): AllValueIndex<string> {
    if (!this.nameIndex) {
      throw 'name index not defined';
    }
    return this.nameIndex;
  }

  get getFinishedTaskIndex(): AllValueIndex<boolean> {
    if (!this.finishedTaskIndex) {
      throw 'finished task index not defined';
    }
    return this.finishedTaskIndex;
  }

  get getDeletedIndex(): AllValueIndex<boolean> {
    if (!this.deletedIndex) {
      throw 'deleted task index not defined';
    }
    return this.deletedIndex;
  }

  logout() {
    this.token = undefined;
    this.tagIndex = undefined;
    this.contextIndex = undefined;
    this.nameIndex = undefined;
    this.finishedTaskIndex = undefined;
    this.deletedIndex = undefined;
  }
}