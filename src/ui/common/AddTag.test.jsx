"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var enzyme_1 = require("enzyme");
var AddTag_1 = require("./AddTag");
var GlobalStore_1 = require("../../store/GlobalStore");
var antd_1 = require("antd");
var enzyme_2 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
enzyme_2.configure({ adapter: new enzyme_adapter_react_16_1.default() });
test('AddTag test', function () {
    var received = undefined;
    var addCallback = function (val) {
        received = val;
    };
    var globalStore = new GlobalStore_1.GlobalStore();
    var node = <AddTag_1.AddTag onAdd={addCallback} store={globalStore}/>;
    expect(node.edit).toBeFalsy();
    var addtag = enzyme_1.shallow(node);
    var icon = addtag.find(antd_1.Icon);
    expect(icon).toBeTruthy();
    icon.simulate('click');
    var autoComplete = addtag.find(antd_1.AutoComplete);
    console.log(autoComplete);
    var callback = autoComplete.prop('onSelect');
    callback('bla');
    expect(received).toEqual('bla');
});
