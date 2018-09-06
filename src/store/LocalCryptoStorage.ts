import { observable } from 'mobx';

let scrypt = require('scryptsy');

// tslint:disable-next-line
let nacl_factory = require('js-nacl');
var chacha = require('chacha');

// tslint:disable-next-line
var nacl: any = null;
// tslint:disable-next-line
nacl_factory.instantiate((ready: any) => {
  console.log('NaCl is ready');
  nacl = ready;
});

type Password = string;
export type Nonce = Uint8Array;
type Key = Uint8Array;
export type EncryptedData = Uint8Array;

export default class LocalCryptoStorage {
  static storage: Storage = window.localStorage;
  static sessionStorage: Storage = window.sessionStorage;
  static crypto: RandomSource = window.crypto;

  @observable loggedIn: boolean;
  private key: Key | null;

  constructor(key: Key | null) {
    this.key = key;
    if (key == null) {
      let item = LocalCryptoStorage.sessionStorage.getItem('key');
      if (item !== null) {
        this.key = fromHex(item);
      }
    }
    if (this.key !== null) {
      this.loggedIn = true;
    }
  }

  // @computed
  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // @action
  set setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
  }

  get getKey(): Key {
    if (this.key === null) {
      let key = LocalCryptoStorage.sessionStorage.getItem('key');
      if (key !== null) {
        this.key = fromHex(key);
      }
    }
    if (this.key === null) {
      throw 'Key not present';
    } else {
      return this.key;
    }
  }

  set setKey(key: Key) {
    let text = toHex8(key);
    LocalCryptoStorage.sessionStorage.setItem('key', text);
    this.key = key;
    this.loggedIn = true;
  }

  encryptFromUtf8(data: string): [EncryptedData, Nonce] {
    let key = this.getKey;
    let message = nacl.encode_utf8(data);
    let nonce = nacl.crypto_secretbox_random_nonce();
    let encrypted = nacl.crypto_secretbox(message, nonce, key);

    return [encrypted, nonce];
  }

  encrypt(data: Uint8Array): [EncryptedData, Nonce] {
    let key = this.getKey;
    let nonce = nacl.crypto_secretbox_random_nonce();
    let encrypted = nacl.crypto_secretbox(data, nonce, key);

    return [encrypted, nonce];
  }

  decryptToUtf8(data: EncryptedData, nonce: Nonce): string {
    let decoded = nacl.crypto_secretbox_open(data, nonce, this.getKey);
    let result = nacl.decode_utf8(decoded);

    return result;
  }

  decrypt(data: EncryptedData, nonce: Nonce): Uint8Array {
    let decoded = nacl.crypto_secretbox_open(data, nonce, this.getKey);
    return decoded;
  }

  exists(): boolean {
    let salt = LocalCryptoStorage.storage.getItem('salt');
    let verification = LocalCryptoStorage.storage.getItem('verification');
    return salt !== null && verification !== null;
  }

  open(pw: Password): boolean {
    let salt = LocalCryptoStorage.storage.getItem('salt');
    let existingVerification = LocalCryptoStorage.storage.getItem('verification');
    if (salt === null || existingVerification === null) {
      return false;
    }

    let key = scrypt(pw, salt, 16384, 8, 1, 32);
    let verification = scrypt(key, salt, 16384, 8, 1, 32).toString('hex');

    if (existingVerification !== verification) {
      return false;
    } else {
      this.setKey = key;
      return true;
    }
  }

  create(pw: Password): void {
    let array = new Uint32Array(32);
    LocalCryptoStorage.crypto.getRandomValues(array);

    let saltString = toHex32(array);
    LocalCryptoStorage.storage.setItem('salt', saltString);

    let key = scrypt(pw, saltString, 16384, 8, 1, 32);
    let verification = scrypt(key, saltString, 16384, 8, 1, 32).toString('hex');
    LocalCryptoStorage.storage.setItem('verification', verification);

    this.setKey = key;
  }

  getRandomValues(array: Uint8Array) {
    LocalCryptoStorage.crypto.getRandomValues(array);
  }
}

function toHex32(array: Uint32Array): string {
  return toHex8(Uint8Array.from(array));
}

function toHex8(array: Uint8Array): string {
  let hexStr = '';
  for (let i = 0; i < array.length; i++) {
    // tslint:disable-next-line
    let hex = (array[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

export function fromHex(hex: string): Uint8Array {

  let array = [];
  for (let i = 0, len = hex.length; i < len; i += 2) {
    array.push(parseInt(hex.substr(i, 2), 16));
  }

  return new Uint8Array(array);
}