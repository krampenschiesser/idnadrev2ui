"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scrypt = require('scryptsy');
var chacha = require('chacha');
var isNode = require('detect-node');
var encoding = require("text-encoding");
var LocalCryptoStorage = /** @class */ (function () {
    function LocalCryptoStorage(key) {
        this.key = key;
    }
    LocalCryptoStorage.prototype.encrypt = function (data, nonce) {
        var cipher = chacha.createCipher(this.key, nonce);
        cipher.setAAD(nonce);
        var buffer = cipher.update(data, 'utf8', 'binary');
        cipher.final('binary');
        var authTag = cipher.getAuthTag();
        return [buffer, authTag];
    };
    LocalCryptoStorage.prototype.decrypt = function (data, nonce, authTag) {
        var decipher = chacha.createDecipher(this.key, nonce);
        decipher.setAAD(nonce);
        decipher.setAuthTag(authTag);
        var json = decipher.update(data, 'binary', 'utf8');
        decipher.final();
        return json;
    };
    LocalCryptoStorage.exists = function () {
        var salt = this.storage.getItem('salt');
        var verification = this.storage.getItem('verification');
        return salt !== null && verification !== null;
    };
    LocalCryptoStorage.open = function (pw) {
        var salt = this.storage.getItem('salt');
        var existingVerification = this.storage.getItem('verification');
        if (salt === null || existingVerification === null) {
            return undefined;
        }
        var key = scrypt(pw, salt, 16384, 8, 1, 32);
        var verification = scrypt(key, salt, 16384, 8, 1, 32).toString('hex');
        if (existingVerification !== verification) {
            return undefined;
        }
        else {
            return new LocalCryptoStorage(key);
        }
    };
    LocalCryptoStorage.create = function (pw) {
        var array = new Uint32Array(32);
        this.crypto.getRandomValues(array);
        var saltString;
        if (isNode) {
            saltString = new encoding.TextDecoder().decode(array);
        }
        else {
            saltString = new TextDecoder().decode(array);
        }
        this.storage.setItem('salt', saltString);
        var key = scrypt(pw, saltString, 16384, 8, 1, 32);
        var verification = scrypt(key, saltString, 16384, 8, 1, 32).toString('hex');
        this.storage.setItem('verification', verification);
        return new LocalCryptoStorage(key);
    };
    LocalCryptoStorage.prototype.getRandomValues = function (array) {
        LocalCryptoStorage.crypto.getRandomValues(array);
    };
    LocalCryptoStorage.storage = window.localStorage;
    LocalCryptoStorage.crypto = window.crypto;
    return LocalCryptoStorage;
}());
exports.default = LocalCryptoStorage;
