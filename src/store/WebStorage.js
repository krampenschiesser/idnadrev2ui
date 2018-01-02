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
var dexie_1 = require("dexie");
var Task_1 = require("../dto/Task");
var Thought_1 = require("../dto/Thought");
var Document_1 = require("../dto/Document");
function prepareForDb(obj) {
    var entries = Object.entries(obj);
    var clone = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], val = _a[1];
        if (val instanceof Object && !(val instanceof Date)) {
            clone[key] = prepareForDb(val);
        }
        else {
            clone[key] = val;
        }
    }
    return clone;
}
exports.prepareForDb = prepareForDb;
function fileDates(file) {
    if (typeof file.created === 'string') {
        file.created = new Date(file.created);
    }
    if (typeof file.updated === 'string') {
        file.updated = new Date(file.updated);
    }
    if (typeof file.deleted === 'string') {
        file.deleted = new Date(file.deleted);
    }
}
function toThought(persisted, localCrypto) {
    if (persisted === undefined) {
        return persisted;
    }
    var decrypt = localCrypto.decrypt(persisted.data, persisted.nonce, persisted.authTag);
    var parse = JSON.parse(decrypt);
    var thought = new Thought_1.default(parse.name, parse.tags, parse.content);
    Object.assign(thought, parse);
    fileDates(thought);
    return thought;
}
exports.toThought = toThought;
function toTask(persisted, localCrypto) {
    if (persisted === undefined) {
        return persisted;
    }
    var decrypt = localCrypto.decrypt(persisted.data, persisted.nonce, persisted.authTag);
    var parse = JSON.parse(decrypt);
    var task = new Task_1.default(parse.name, parse.tags, parse.content);
    Object.assign(task, parse);
    fileDates(task);
    if (typeof task.details.finished === 'string') {
        task.details.finished = new Date(task.details.finished);
    }
    if (task.details.delegation && typeof task.details.delegation.time === 'string') {
        task.details.delegation.time = new Date(task.details.delegation.time);
    }
    if (task.details.schedule) {
        var fixedScheduling = task.details.schedule.fixedScheduling;
        if (fixedScheduling && typeof fixedScheduling.scheduledDateTime === 'string') {
            fixedScheduling.scheduledDateTime = new Date(fixedScheduling.scheduledDateTime);
        }
        var proposedDate = task.details.schedule.proposedDate;
        if (proposedDate && typeof proposedDate.proposedDateTime === 'string') {
            proposedDate.proposedDateTime = new Date(proposedDate.proposedDateTime);
        }
        task.details.workUnits.forEach(function (unit) {
            if (typeof unit.start === 'string') {
                unit.start = new Date(unit.start);
            }
            if (typeof unit.end === 'string') {
                unit.end = new Date(unit.end);
            }
        });
    }
    return task;
}
exports.toTask = toTask;
function toDocument(persisted, localCrypto) {
    if (persisted === undefined) {
        return persisted;
    }
    var decrypt = localCrypto.decrypt(persisted.data, persisted.nonce, persisted.authTag);
    var parse = JSON.parse(decrypt);
    var doc = new Document_1.default(parse.name, parse.tags, parse.content);
    Object.assign(doc, parse);
    fileDates(doc);
    return doc;
}
var WebStorage = /** @class */ (function (_super) {
    __extends(WebStorage, _super);
    function WebStorage(crypto) {
        var _this = _super.call(this, "IdnadrevDb") || this;
        _this.localCrypto = crypto;
        _this.version(1).stores({
            tasks: 'id, details.finished, details.delegation, details.context, details.state',
            docs: 'id',
            thoughts: 'id, details.showAgainAfter',
        });
        return _this;
    }
    WebStorage.prototype.store = function (obj) {
        var json = JSON.stringify(obj);
        var nonce = new Uint8Array(12);
        this.localCrypto.getRandomValues(nonce);
        var _a = this.localCrypto.encrypt(json, nonce), encrypted = _a[0], authTag = _a[1];
        if (obj instanceof Thought_1.default) {
            var data = {
                data: encrypted,
                nonce: nonce,
                id: obj.id,
                authTag: authTag,
                details: {
                    showAgainAfter: obj.details.showAgainAfter
                }
            };
            return this.thoughts.put(data);
        }
        else if (obj instanceof Document_1.default) {
            var data = {
                data: encrypted,
                nonce: nonce,
                id: obj.id,
                authTag: authTag,
            };
            return this.docs.put(data);
        }
        else if (obj instanceof Task_1.default) {
            var data = {
                data: encrypted,
                nonce: nonce,
                id: obj.id,
                authTag: authTag,
                details: {
                    finished: obj.isFinished,
                    delegation: obj.isDelegated,
                    context: obj.context,
                    state: obj.state
                }
            };
            return this.tasks.put(data);
        }
        return Promise.reject('No compatible type ' + typeof obj);
    };
    WebStorage.prototype.loadThoughtById = function (id) {
        var _this = this;
        return this.thoughts.where('id').equals(id).first().then(function (persistedThought) { return toThought(persistedThought, _this.localCrypto); });
    };
    WebStorage.prototype.loadDocumentById = function (id) {
        var _this = this;
        return this.docs.where('id').equals(id).first().then(function (persistedDoc) { return toDocument(persistedDoc, _this.localCrypto); });
    };
    WebStorage.prototype.loadTaskById = function (id) {
        var _this = this;
        return this.tasks.where('id').equals(id).first().then(function (persistedTask) { return toTask(persistedTask, _this.localCrypto); });
    };
    return WebStorage;
}(dexie_1.default));
exports.default = WebStorage;
