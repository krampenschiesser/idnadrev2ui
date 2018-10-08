import React from 'react';
import { mount } from 'enzyme';
import TestStore from '../../../test/DbMock.test';
import mock from '../../../test/Browsermock.test';

import Repository from '../../../dto/Repository';
import UiStore from '../../../store/UiStore';
import waitUntil from 'async-wait-until';
import ProcessThoughts from '../ProcessThoughts';
import Thought from '../../../dto/Thought';
import { ThoughtToTask } from '../ThoughtActions';

// @ts-ignore
const unused = mock;
const store = TestStore;


test('Thought to task', async () => {
  jest.setTimeout(30000);
  let repo = new Repository('test', 'test');
  await store.webStorage.storeRepository(repo);
  await store.loadRepositories();
  repo = store.repositories[0];
  await store.openRepository(repo, 'test');

  expect(store.openRepositories.length).toEqual(1);
  expect(store.openRepositories[0].token).toBeDefined();

  await store.store(new Thought('Task').withRepository(repo.id));

  let rendered = mount(<ProcessThoughts store={store} uiStore={new UiStore()} children={[]}/>);

  console.log("Before waiting", new Date())
  await waitUntil(async () => {
  console.log("waiting", new Date())
    return rendered.find(ThoughtToTask).length == 1
  }, 10000);
  console.log("Before waiting 2", new Date())
  await waitUntil(async () => {
  console.log("waiting 2", new Date())
    return rendered.find(ThoughtToTask).find('button').length == 1
  }, 10000);
  console.log("After waiting", new Date())


  expect(rendered.find(ThoughtToTask).length).toEqual(1);
  expect(rendered.find(ThoughtToTask).find('button').length).toEqual(1);
  rendered.find(ThoughtToTask).find('button').simulate('click');

  await waitUntil(async () => {
    let tasks = await store.getTasks();
    return tasks.length == 1;
  }, 3000);

  let tasks = await store.getTasks();
  expect(tasks.length).toEqual(1);
  // let thoughts = await store.getOpenThoughts();
  // expect(thoughts.length).toEqual(1);
  // expect(thoughts[0].name).toEqual('Hello');
  // expect(thoughts[0].repository).toEqual(repo.id);
  // expect(thoughts[0].content).toEqual('Content');
});
