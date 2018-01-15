"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var Document_1 = require("../Document");
var Task_1 = require("../Task");
var Thought_1 = require("../Thought");
var WebStorage_1 = require("../../store/WebStorage");
var structuredClone = require('realistic-structured-clone');
test('Clone document', function () {
    var item = new Document_1.default('hello');
    var clone = structuredClone(WebStorage_1.prepareForDb(item));
    expect(clone).not.toBeUndefined();
    expect(clone.name).not.toBeUndefined();
    expect(clone.name).toBe('hello');
    expect(clone.created).toEqual(item.created);
});
test('Clone task', function () {
    var item = new Task_1.default('hello');
    var clone = structuredClone(WebStorage_1.prepareForDb(item));
    expect(clone).not.toBeUndefined();
    expect(clone.name).not.toBeUndefined();
    expect(clone.name).toBe('hello');
    expect(clone.created).toEqual(item.created);
});
test('Clone thought', function () {
    var item = new Thought_1.default('hello');
    var clone = structuredClone(WebStorage_1.prepareForDb(item));
    expect(clone).not.toBeUndefined();
    expect(clone.name).not.toBeUndefined();
    expect(clone.name).toBe('hello');
    expect(clone.created).toEqual(item.created);
});
