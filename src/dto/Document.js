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
Object.defineProperty(exports, "__esModule", { value: true });
var IdnadrevFile_1 = require("./IdnadrevFile");
var FileType_1 = require("./FileType");
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(name, tags, content) {
        if (tags === void 0) { tags = []; }
        if (content === void 0) { content = ''; }
        var _this = _super.call(this, name, FileType_1.FileType.Document) || this;
        _this.tags = tags;
        _this.content = content;
        return _this;
    }
    return Document;
}(IdnadrevFile_1.default));
exports.default = Document;
