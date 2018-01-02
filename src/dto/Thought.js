"use strict";
/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
 */
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
var ThoughtDetails = /** @class */ (function () {
    function ThoughtDetails() {
    }
    return ThoughtDetails;
}());
exports.ThoughtDetails = ThoughtDetails;
var Thought = /** @class */ (function (_super) {
    __extends(Thought, _super);
    function Thought(name, tags, content) {
        if (tags === void 0) { tags = []; }
        if (content === void 0) { content = ''; }
        var _this = _super.call(this, name, FileType_1.FileType.Thought) || this;
        _this.tags = tags;
        _this.content = content;
        _this.details = new ThoughtDetails();
        return _this;
    }
    return Thought;
}(IdnadrevFile_1.default));
exports.default = Thought;
