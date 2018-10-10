import * as scrypt from 'scryptsy';
import * as nacl_factory from 'js-nacl';

// tslint:disable-next-line
var nacl: any = null;
// tslint:disable-next-line
nacl_factory.instantiate((ready: any) => {
  console.log('NaCl is ready');
  nacl = ready;
});

export class RandomHelper {
  static getRandomValues?: (array: Uint32Array | Uint8Array) => void = undefined;

  static fillRandom(array: Uint8Array | Uint32Array) {
    if (this.getRandomValues) {
      this.getRandomValues(array);
    } else {
      crypto.getRandomValues(array);
    }
  }
}


export type Nonce = Uint8Array;
export type Key = Uint8Array;
export type EncryptedData = Uint8Array;

// fixme externalize to worker in the future
export function hash(plaintext: string, salt: string): Promise<Uint8Array> {
  return new Promise<Uint8Array>(((resolve, reject) => {
    const key = scrypt(plaintext, salt, 16384, 8, 1, 32);
    resolve(key);
  }));
}

// fixme externalize to worker in the future
export function doubleHash(plaintext: string, salt: string): Promise<[Uint8Array, Uint8Array]> {
  return new Promise<[Uint8Array, Uint8Array]>(((resolve, reject) => {
    const key = scrypt(plaintext, salt, 16384, 8, 1, 32);
    const double = scrypt(key, salt, 16384, 8, 1, 32);
    resolve([key, double]);
  }));
}

export function hashSync(plaintext: string | Uint8Array, salt: string): Uint8Array {
  const key = scrypt(plaintext, salt, 16384, 8, 1, 32);
  return key;
}

export function doubleHashSync(plaintext: string, salt: string): Uint8Array {
  const key = scrypt(plaintext, salt, 16384, 8, 1, 32);
  const double = scrypt(key, salt, 16384, 8, 1, 32);
  return double;
}

// fixme externalize to worker in the future
export function encrypt(data: Uint8Array | string, key: Key): Promise<[EncryptedData, Nonce]> {
  return new Promise<[EncryptedData, Nonce]>((resolve, reject) => {
    resolve(encryptSync(data, key));
  });
}

export function encryptSync(data: Uint8Array | string, key: Key): [EncryptedData, Nonce] {
  if (typeof  data === 'string') {
    data = nacl.encode_utf8(data);
  }
  const nonce = nacl.crypto_secretbox_random_nonce();
  const encrypted = nacl.crypto_secretbox(data, nonce, key);
  return [encrypted, nonce];
}

// fixme externalize to worker in the future
export function decryptToUtf8(data: EncryptedData, nonce: Nonce, key: Key): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const decoded = nacl.crypto_secretbox_open(data, nonce, key);
    const result = nacl.decode_utf8(decoded);
    resolve(result);
  });
}

// fixme externalize to worker in the future
export function decrypt(data: EncryptedData, nonce: Nonce, key: Key): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const decoded = nacl.crypto_secretbox_open(data, nonce, key);
    resolve(decoded);
  });
}


export function fillRandomValues(array: Uint8Array | Uint32Array) {
  RandomHelper.fillRandom(array);
}

export function toHex32(array: Uint32Array): string {
  return toHex8(Uint8Array.from(array));
}

export function toHex8(array: Uint8Array): string {
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
  const array = [];
  for (let i = 0, len = hex.length; i < len; i += 2) {
    array.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(array);
}
