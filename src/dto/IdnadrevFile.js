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
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var IdnadrevFile = /** @class */ (function () {
    function IdnadrevFile(name, fileType) {
        this.id = uuid_1.v4();
        this.name = name;
        this.created = new Date();
        this.updated = new Date();
        this.version = 0;
        this.tags = [];
        this.fileType = fileType;
    }
    IdnadrevFile.prototype.addTag = function (tag) {
        this.tags.push(tag);
    };
    return IdnadrevFile;
}());
exports.default = IdnadrevFile;
