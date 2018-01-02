"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var enzyme_1 = require("enzyme");
var TagContainer_1 = require("./TagContainer");
var antd_1 = require("antd");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
var Thought_1 = require("../../dto/Thought");
var Tag_1 = require("../../dto/Tag");
var GlobalStore = require('../../store/GlobalStore').default;
console.log(GlobalStore);
GlobalStore.prototype.getTagsStartingWith = jest.fn();
GlobalStore.prototype.getTagsStartingWith.mockImplementation(function (input) {
    var strings = ["steak", "beer", "potatoes"];
    return strings.filter(function (s) { return s.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()); });
});
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
test('TagContainer test', function () {
    var globalStore = new GlobalStore();
    var thought = new Thought_1.default("test", [new Tag_1.Tag("hello")]);
    var node = <TagContainer_1.default store={globalStore} item={thought}/>;
    var tagcontainer = enzyme_1.shallow(node);
    expect(tagcontainer.find(antd_1.Tag)).toHaveLength(1);
    var autoComplete = tagcontainer.find(antd_1.AutoComplete);
    var callback = autoComplete.prop('onSelect');
    callback('bla');
    expect(tagcontainer.find(antd_1.Tag)).toHaveLength(2);
});
