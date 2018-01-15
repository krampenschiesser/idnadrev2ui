"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", {value: true});
var mobx_react_1 = require("mobx-react");
var React = require("react");
var antd_1 = require("antd");
var mobx_1 = require("mobx");
var Tag_1 = require("../../dto/Tag");
var TagContainerProps = /** @class */ (function () {
    function TagContainerProps() {
    }

    return TagContainerProps;
}());
exports.TagContainerProps = TagContainerProps;
var TagContainer = /** @class */ (function (_super) {
    __extends(TagContainer, _super);

    function TagContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.addTag = function (tag) {
            _this.fileTags.push(tag);
            _this.props.item.tags.push(new Tag_1.Tag(tag));
        };
        _this.removeTag = function (tag) {
            _this.fileTags = _this.fileTags.filter(function (e) {
                return e !== tag;
            });
            _this.props.item.tags = _this.props.item.tags.filter(function (e) {
                return e.name !== tag;
            });
        };
        return _this;
    }

    TagContainer.prototype.componentDidMount = function () {
        this.possibleTags = this.props.store.getTagsStartingWith("");
        this.fileTags = this.props.item.tags.map(function (tag) {
            return tag.name;
        });
    };
    TagContainer.prototype.render = function () {
        var _this = this;
        var TagContainerautocomplete = <antd_1.AutoComplete dataSource={this.possibleTags} onSelect={this.addTag}/>;
        return (<antd_1.Row>
            <antd_1.Col xs={24} md={6}>{autocomplete}</antd_1.Col>
            {this.fileTags.map(function (e) {
                return <antd_1.Tag closable onClose={_this.removeTag}>{e}</antd_1.Tag>;
            })}
        </antd_1.Row>);
    };
    __decorate([
        mobx_1.observable
    ], TagContainer.prototype, "possibleTags", void 0);
    __decorate([
        mobx_1.observable
    ], TagContainer.prototype, "fileTags", void 0);
    TagContainer = __decorate([
        mobx_react_1.observer
    ], TagContainer);
    return TagContainer;
}(React.Component));
exports.default = TagContainer;
