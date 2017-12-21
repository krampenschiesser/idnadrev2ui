import WebStorage, {prepareForDb} from "../WebStorage"
import Dexie from "dexie";
import Document from "../../dto/Document"
import Task from "../../dto/Task";
import Thought from "../../dto/Thought";
import LocalCryptoStorage from "../LocalCryptoStorage";
import {LocalStorage} from "node-localstorage"

Dexie.dependencies.indexedDB = require('fake-indexeddb');
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

class Crypto {
  getRandomValues(arr: Uint8Array) {
    let val = 1;
    for (let i in arr) {
      arr[i] = val++;
    }
  }
}

LocalCryptoStorage.storage = new LocalStorage('test')
LocalCryptoStorage.storage.clear()
LocalCryptoStorage.crypto = new Crypto();
var crypto = LocalCryptoStorage.create("test123")

test('Persist plain document', () => {
  let db = new WebStorage(crypto);
  let original = new Document('hello');
  db.store(original);

  return db.loadDocumentById(original.id).then(doc => {
    if (doc) {
      expect(doc.name).toBe("hello");
      expect(doc.created).toEqual(original.created);
      expect(doc.updated).toEqual(original.updated);
    } else {
      expect(doc).not.toBeUndefined()
    }
  });
});
test('Persist plain task', () => {
  let db = new WebStorage(crypto);
  let original = new Task('hello');
  db.store(original);
  return db.loadTaskById(original.id).then(task => {
    if (task) {
      expect(task.name).toBe("hello");
      expect(original.created).toEqual(task.created);
    } else {
      expect(task).not.toBeUndefined()
    }
  });
});
test('Persist plain thought', () => {
  let db = new WebStorage(crypto);
  let original = new Thought('hello');
  db.store(original)
  return db.loadThoughtById(original.id).then(thought => {
    if (thought) {
      expect(thought.name).toBe("hello");
      expect(original.created).toEqual(thought.created);
    } else {
      expect(thought).not.toBeUndefined()
    }
  });
});