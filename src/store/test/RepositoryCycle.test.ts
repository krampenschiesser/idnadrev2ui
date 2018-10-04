import Repository from '../../dto/Repository';
import Task from '../../dto/Task';
import { Tag } from '../../dto/Tag';
import TestStore from "../../test/DbMock.test";

const store = TestStore;
const webStorage = TestStore.webStorage;

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
