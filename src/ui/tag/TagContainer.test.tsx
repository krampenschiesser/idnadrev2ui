import React from 'react';
import { shallow, configure } from 'enzyme';
import TagContainer from './TagContainer';
import { AutoComplete, Tag } from 'antd';

import Adapter from 'enzyme-adapter-react-16';
import Thought from '../../dto/Thought';
import { Tag as TagDto } from '../../dto/Tag';


var GlobalStore = require('../../store/GlobalStore').default;
console.log(GlobalStore);
GlobalStore.prototype.getTagsStartingWith = jest.fn();
GlobalStore.prototype.getTagsStartingWith.mockImplementation(function (input: string) {
  let strings: string[] = ['steak', 'beer', 'potatoes'];
  return strings.filter(s => s.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()));
});

configure({adapter: new Adapter()});

test('TagContainer test', () => {

  let globalStore = new GlobalStore();

  let thought = new Thought('test', [new TagDto('hello')]);

  let node = <TagContainer store={globalStore} item={thought}/>;
  const tagcontainer = shallow(node);

  expect(tagcontainer.find(Tag)).toHaveLength(1);

  let autoComplete = tagcontainer.find(AutoComplete);

  let callback = autoComplete.prop('onSelect');
  callback('bla');

  expect(tagcontainer.find(Tag)).toHaveLength(2);
});