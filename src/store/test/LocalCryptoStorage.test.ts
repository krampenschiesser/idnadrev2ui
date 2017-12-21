import LocalCryptoStorage, {Nonce} from "../LocalCryptoStorage"

import {LocalStorage} from "node-localstorage"

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./test');
// }

class Crypto {
  getRandomValues(arr: Uint8Array) {
    let val = 1;
    for (let i in arr) {
      arr[i] = val++;
    }
  }
}

test('CryptoStorage basics', () => {
  LocalCryptoStorage.storage = new LocalStorage('test')
  LocalCryptoStorage.storage.clear()
  LocalCryptoStorage.crypto = new Crypto();

  expect(LocalCryptoStorage.exists()).toBeFalsy();
  expect(LocalCryptoStorage.open("test123")).toBeUndefined();

  let storage = LocalCryptoStorage.create("test123");


  let array = new Uint8Array(12);
  LocalCryptoStorage.crypto.getRandomValues(array);
  let nonce = array;

  let [encrypt, authTag] = storage.encrypt("Hello Sauerland", nonce);
  let decrypt = storage.decrypt(encrypt, nonce, authTag);
  expect(decrypt).toEqual("Hello Sauerland");
});

test('Chacha standalone', () => {
  let text = 'Hallo Welt';
  let nonce = Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)
  let key = Uint8Array.of(11, 22, 1, 3, 7, 1, 2, 8, 3, 9, 2, 3, 6, 2, 1, 0, 9, 1, 4, 7, 3, 2, 4, 8, 5, 7, 2, 3, 2, 5, 21, 1)

  let chacha = require('chacha');

  let cipher = chacha.createCipher(key, nonce);
  cipher.setAAD(nonce);
  let buffer = cipher.update(text, 'utf8','binary');
  cipher.final('binary');
  let authTag = cipher.getAuthTag();

  let decipher = chacha.createDecipher(key, nonce);
  decipher.setAAD(nonce);
  decipher.setAuthTag(authTag);
  let result2 = decipher.update(buffer,'binary','utf8');
  decipher.final('utf8');
  expect(result2).toEqual(text)
});