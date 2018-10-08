import React from 'react';
import { mount } from 'enzyme';
import TestStore from '../../../test/DbMock.test';
import mock from '../../../test/Browsermock.test';

import Repository from '../../../dto/Repository';
import { AddThought } from '../AddThought';
import UiStore from '../../../store/UiStore';
import NameFormItem from '../../form/NameFormItem';
import { Input } from 'antd';
import waitUntil from 'async-wait-until';
import { MarkdownEditor } from '../../editor/MarkdownEditor';

// @ts-ignore
const unused = mock;
const store = TestStore;


test('Add thought', async () => {
  MarkdownEditor.useTextArea = true;
  jest.setTimeout(30000);
  let repo = new Repository('test', 'test');
  await store.webStorage.storeRepository(repo);
  await store.loadRepositories();
  repo = store.repositories[0];
  await store.openRepository(repo, 'test');

  expect(store.openRepositories.length).toEqual(1);
  expect(store.openRepositories[0].token).toBeDefined();

  let rendered = mount(<AddThought store={store} uiStore={new UiStore()} children={[]}/>);
  let nameItem = rendered.find(NameFormItem);
  expect(nameItem.length).toEqual(1);
  let find = nameItem.find(Input);
  expect(find.length).toEqual(1);
  find.simulate('change', {target: {value: 'Hello'}});

  rendered.find(MarkdownEditor).find('textarea').simulate('change', {target: {value: 'Content'}});

  rendered.find('button').simulate('click');

  await waitUntil(async () => {
    let thoughts = await store.getOpenThoughts();
    return thoughts.length == 1;
  }, 3000);

  let thoughts = await store.getOpenThoughts();
  expect(thoughts.length).toEqual(1);
  expect(thoughts[0].name).toEqual('Hello');
  expect(thoughts[0].repository).toEqual(repo.id);
  expect(thoughts[0].content).toEqual('Content');
});
