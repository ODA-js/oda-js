"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_hex_1 = __importDefault(require("md5-hex"));
const globalIds_1 = require("./globalIds");
function decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding =
        typeof padding === 'undefined' || padding === null
            ? (padding = 2)
            : padding;
    while (hex.length < padding) {
        hex = '0' + hex;
    }
    return hex;
}
class IdGenerator {
    static generateMongoId() {
        return (Math.trunc(Date.now() / 1000)
            .toString(16)
            .slice(0, 8) +
            md5_hex_1.default(this.browser
                ? window.location.href
                : (process.title + process.version).toString()).slice(0, 6) +
            decimalToHex(this.browser
                ? Math.floor(Math.random() * 100000 * Math.random())
                : process.pid, 4).slice(0, 4) +
            decimalToHex(this.counter++, 6).slice(0, 6));
    }
    static generateIdFor(typeName) {
        return globalIds_1.toGlobalId(typeName, this.generateMongoId());
    }
    static getIdForFromKey(typeName, key) {
        return globalIds_1.toGlobalId(typeName, key);
    }
    static generateIdForWithId(typeName, id) {
        return globalIds_1.toGlobalId(typeName, id);
    }
    static reverse(id) {
        return globalIds_1.fromGlobalId(id);
    }
}
IdGenerator.browser = !global.hasOwnProperty('process');
IdGenerator.counter = 0;
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=idGenerator.js.map