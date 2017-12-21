let scrypt = require('scryptsy');
let chacha = require('chacha');

var isNode = require('detect-node');
import * as encoding from "text-encoding";

type Password = string;
export type AuthTag = Uint8Array;
export type Nonce = Uint8Array;
type Key = Uint8Array;
export type EncryptedData = Uint8Array;

export default class LocalCryptoStorage {
  static storage: any = window.localStorage;
  static crypto: any = window.crypto;

  key: Key;


  constructor(key: Key) {
    this.key = key;
  }

  encrypt(data: string, nonce: Nonce): [EncryptedData, AuthTag] {
    let cipher = chacha.createCipher(this.key, nonce);
    cipher.setAAD(nonce);
    let buffer = cipher.update(data, 'utf8', 'binary');
    cipher.final('binary');
    let authTag = cipher.getAuthTag();
    return [buffer, authTag];
  }

  decrypt(data: EncryptedData, nonce: Nonce, authTag: AuthTag): string {
    let decipher = chacha.createDecipher(this.key, nonce);
    decipher.setAAD(nonce);
    decipher.setAuthTag(authTag);
    let json = decipher.update(data, 'binary', 'utf8');
    decipher.final();
    return json;
  }

  static exists(): boolean {
    let salt = this.storage.getItem('salt');
    let verification = this.storage.getItem('verification');
    return salt !== null && verification !== null;
  }

  static open(pw: Password): LocalCryptoStorage | undefined {
    let salt = this.storage.getItem('salt');
    let existingVerification = this.storage.getItem('verification');
    if (salt === null || existingVerification === null) {
      return undefined;
    }

    let key = scrypt(pw, salt, 16384, 8, 1, 32)
    let verification = scrypt(key, salt, 16384, 8, 1, 32).toString('hex')

    if (existingVerification !== verification) {
      return undefined;
    } else {
      return new LocalCryptoStorage(key);
    }
  }

  static create(pw: Password): LocalCryptoStorage {
    let array = new Uint32Array(32);
    this.crypto.getRandomValues(array);

    let saltString;
    if (isNode) {
      saltString = new encoding.TextDecoder().decode(array);
    } else {
      saltString = new TextDecoder().decode(array);
    }
    this.storage.setItem('salt', saltString);

    let key = scrypt(pw, saltString, 16384, 8, 1, 32)
    let verification = scrypt(key, saltString, 16384, 8, 1, 32).toString('hex')
    this.storage.setItem('verification', verification)

    return new LocalCryptoStorage(key);
  }

  getRandomValues(array: Uint8Array) {
    LocalCryptoStorage.crypto.getRandomValues(array);
  }
}