import React from 'react';
import {shallow} from 'enzyme';
import {AddTag} from "./AddTag";
import {GlobalStore} from "../../store/GlobalStore";
import {Icon, AutoComplete} from "antd"

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

test('AddTag test', () => {
  let received: string | undefined = undefined;
  let addCallback = (val: string) => {
    received = val
  }

  let globalStore = new GlobalStore();
  let node = <AddTag onAdd={addCallback} store={globalStore}/>;
  expect(node.edit).toBeFalsy()

  const addtag = shallow(node);
  let icon = addtag.find(Icon);
  expect(icon).toBeTruthy();
  icon.simulate('click');
  let autoComplete = addtag.find(AutoComplete);
  console.log(autoComplete)
  let callback = autoComplete.prop('onSelect');
  callback('bla')

  expect(received).toEqual('bla')
})