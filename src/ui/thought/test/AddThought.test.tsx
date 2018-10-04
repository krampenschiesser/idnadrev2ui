import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import TestStore from '../../../test/DbMock.test';
import Repository from '../../../dto/Repository';
import { AddThought } from '../AddThought';
import UiStore from '../../../store/UiStore';
import NameFormItem from '../../form/NameFormItem';


const store = TestStore;
configure({ adapter: new Adapter() });


test('Store repository and open with indexes', async () => {
  jest.setTimeout(30000);
  let repo = new Repository('test', 'test');
  await store.webStorage.storeRepository(repo);
  await store.loadRepositories();
  await store.openRepository(repo, 'test');

  expect(store.openRepositories.length).toEqual(1);

  let rendered = shallow(<AddThought store={store} uiStore={new UiStore()} children={[]}/>);
  console.log(rendered)
  rendered.find(NameFormItem).find('input').value = "bla";
  rendered.find('button').simulate('click')
});
