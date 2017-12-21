"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var antd_1 = require("antd");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var AddTag = /** @class */ (function (_super) {
    __extends(AddTag, _super);
    function AddTag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tags = [];
        _this.autoComplete = function (input) {
            var tags = _this.props.store.getTagsStartingWith(input);
            _this.tags = tags;
        };
        _this.toggle = function () {
            console.log('here');
            _this.edit = !_this.edit;
        };
        return _this;
    }
    AddTag.prototype.render = function () {
        var _this = this;
        if (this.edit) {
            var autocomplete = <antd_1.AutoComplete dataSource={this.tags} style={{ width: 200 }} onSearch={this.autoComplete} onSelect={function (value) { return _this.props.onAdd(value); }} placeholder="New Tag"/>;
            autocomplete.blur = this.toggle;
            return autocomplete;
        }
        else {
            return (<span onClick={this.toggle}><antd_1.Tag><antd_1.Icon type="plus"/> New Tag</antd_1.Tag></span>);
        }
    };
    __decorate([
        mobx_1.observable
    ], AddTag.prototype, "edit", void 0);
    __decorate([
        mobx_1.observable
    ], AddTag.prototype, "tags", void 0);
    AddTag = __decorate([
        mobx_react_1.observer
    ], AddTag);
    return AddTag;
}(React.Component));
exports.AddTag = AddTag;
