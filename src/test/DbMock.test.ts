import Dexie from 'dexie';
import * as localStorage from 'mock-local-storage';
import WebStorage from '../store/WebStorage';
import GlobalStore from '../store/GlobalStore';
import { RandomHelper } from '../store/CryptoHelper';


// @ts-ignore
global.window = {};
// @ts-ignore
window.localStorage = global.localStorage;
// @ts-ignore
window.sessionStorage = global.sessionStorage;
// @ts-ignore
let _bla = localStorage;

Dexie.dependencies.indexedDB = require('fake-indexeddb');
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
WebStorage.populate = false;

const webStorage = new WebStorage();
const TestStore = new GlobalStore(webStorage);

function randomMock<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | null>(array: T): T {
  if (array) {
    if (array instanceof DataView) {
      return array;
    }
    for (let i = 0; i < array.length; i++) {
      array[i] = i + 1;
    }
  }
  return array;
}

RandomHelper.getRandomValues = randomMock;

export default TestStore;