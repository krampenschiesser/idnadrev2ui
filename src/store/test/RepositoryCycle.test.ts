import WebStorage from '../WebStorage';
import GlobalStore from '../GlobalStore';
import Repository from '../../dto/Repository';
import Task from '../../dto/Task';
import { Tag } from '../../dto/Tag';
import { RandomHelper } from '../CryptoHelper';
import Dexie from 'dexie';
import * as localStorage from 'mock-local-storage';


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
const store = new GlobalStore(webStorage);

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

test('Store repository and open with indexes', async () => {
  jest.setTimeout(30000);
  let repo = new Repository('test', 'test');
  await store.webStorage.storeRepository(repo);

  repo.logout();

  let repos = await store.loadRepositories();
  expect(repos.length).toEqual(1);
  repo = repos[0];
  await store.openRepository(repo, 'test');
  expect(repo.token).toBeDefined();
  expect(repo.getContextIndex).toBeDefined();
  expect(repo.getFinishedTaskIndex).toBeDefined();
  expect(repo.getNameIndex).toBeDefined();
  expect(repo.getTagIndex).toBeDefined();

  let task = new Task('test', [new Tag('tag')]);
  task.details.context = 'context';

  await webStorage.store(task, repo);
  expect(repo.getTagIndex.getAllValues()).toContainEqual(new Tag('tag'));
  expect(repo.getContextIndex.getAllValues()).toContainEqual('context');
  expect(repo.getNameIndex.getAllValues()).toContainEqual('test');

  repo.logout();
  await store.openRepository(repo, 'test');
  expect(repo.getTagIndex.getAllValues()).toContainEqual(new Tag('tag'));
  expect(repo.getContextIndex.getAllValues()).toContainEqual('context');
  expect(repo.getNameIndex.getAllValues()).toContainEqual('test');

});