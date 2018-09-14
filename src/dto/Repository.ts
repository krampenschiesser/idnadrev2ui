import { observable } from 'mobx';
import { RepositoryId } from './RepositoryId';
import { RepositoryToken } from './RepositoryToken';
import { decrypt, decryptToUtf8, encrypt, EncryptedData, encryptFromUtf8, fillRandomValues, hashSync, Nonce, toHex32 } from '../store/CryptoHelper';
import uuid from 'uuid';

export default class Repository {
  id: RepositoryId;
  @observable name: string;
  @observable token?: RepositoryToken;
  salt: Uint32Array = new Uint32Array(32);
  nonce: Nonce;
  data: Uint8Array;

  constructor(name: string, pw: string) {
    this.name = name;
    this.id = uuid.v4();

    let encryptionPw = new Uint8Array(32);
    fillRandomValues(encryptionPw);
    this.token = encryptionPw;

    fillRandomValues(this.salt);
    let salty = toHex32(this.salt);
    let hashedPw = hashSync(pw, salty);

    let tuple = encrypt(encryptionPw, hashedPw);
    this.data = tuple[0];
    this.nonce = tuple[1];
  }

  changePw(old: string, current: string): Promise<boolean> {
    let saltString = toHex32(this.salt);
    let hashedPw = hashSync(old, saltString);
    return decrypt(this.data, this.nonce, hashedPw).then(token => {
      fillRandomValues(this.salt);
      let salty = toHex32(this.salt);
      let hashedPw = hashSync(current, salty);

      let tuple = encrypt(token, hashedPw);
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

  encryptText(text: string): Promise<[EncryptedData, Nonce]> {
    if (this.token) {
      return encryptFromUtf8(text, this.token);
    } else {
      return new Promise<[EncryptedData, Nonce]>((resolve, reject) => reject('not logged into repository'));
    }
  }

  encrypt(data: Uint8Array): Promise<[EncryptedData, Nonce]> {
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

  open(pw: string): Promise<boolean> {
    let saltString = toHex32(this.salt);
    let hashedPw = hashSync(pw, saltString);
    return decrypt(this.data, this.nonce, hashedPw).then(fulfilled => {
      this.token = fulfilled;
      return true;
    }).catch(rejected => {
      return false;
    });
  }
}