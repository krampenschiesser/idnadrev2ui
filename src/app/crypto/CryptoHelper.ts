import { scrypt_simple, to_uint8, encrypt as chacha_encrypt, decrypt as chacha_decrypt, to_utf8 } from 'rasm-crypt';


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
    let salt_uint8 = to_uint8(salt);
    let plaintext_uint8 = to_uint8(plaintext);
    const key = scrypt_simple(plaintext_uint8, salt_uint8, 32);
    resolve(key);
  }));
}

// fixme externalize to worker in the future
export function doubleHash(plaintext: string, salt: string): Promise<[Uint8Array, Uint8Array]> {
  return new Promise<[Uint8Array, Uint8Array]>(((resolve, reject) => {
    let salt_uint8 = to_uint8(salt);
    let plaintext_uint8 = to_uint8(plaintext);
    const key = scrypt_simple(plaintext_uint8, salt_uint8, 32);
    const double = scrypt_simple(key, salt_uint8, 32);
    resolve([key, double]);
  }));
}

export function hashSync(plaintext: string | Uint8Array, salt: string): Uint8Array {
  let salt_uint8 = to_uint8(salt);
  if (typeof  plaintext === 'string') {
    plaintext = to_uint8(plaintext);
  }
  const key = scrypt_simple(plaintext, salt_uint8, 32);
  return key;
}

export function doubleHashSync(plaintext: string, salt: string): Uint8Array {
  let salt_uint8 = to_uint8(salt);
  let plaintext_uint8 = to_uint8(plaintext);
  const key = scrypt_simple(plaintext_uint8, salt_uint8, 32);
  const double = scrypt_simple(key, salt_uint8, 32);
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
    data = to_uint8(data);
  }
  const nonce = new Uint8Array(12);
  fillRandomValues(nonce);

  let res = chacha_encrypt(key, nonce, new Uint8Array(0), data);
  let authTag = res.get_auth_tag();
  let ciphertext = res.get_ciphertext();
  let encrypted = new Uint8Array(authTag.length + ciphertext.length);
  encrypted.set(authTag, 0);
  encrypted.set(ciphertext, authTag.length);
  return [encrypted, nonce];
}

// fixme externalize to worker in the future
export function decryptToUtf8(data: EncryptedData, nonce: Nonce, key: Key): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let tag = data.slice(0, 16);
    let ciphertext = data.slice(16, data.length);

    const decoded = chacha_decrypt(key, nonce, new Uint8Array(0), tag, ciphertext);
    const result = to_utf8(decoded);
    resolve(result);
  });
}

// fixme externalize to worker in the future
export function decrypt(data: EncryptedData, nonce: Nonce, key: Key): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    let tag = data.slice(0, 16);
    let ciphertext = data.slice(16, data.length);

    const decoded = chacha_decrypt(key, nonce, new Uint8Array(0), tag, ciphertext);
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
