"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unbase64_1 = __importDefault(require("./unbase64"));
const base64_1 = __importDefault(require("./base64"));
const DELIMITER = ':';
function fromGlobalId(globalId, delimiter) {
    const unbasedGlobalId = unbase64_1.default(globalId);
    const delimiterPos = unbasedGlobalId.indexOf(delimiter || DELIMITER);
    if (delimiterPos > -1) {
        return {
            type: unbasedGlobalId.substring(0, delimiterPos),
            id: unbasedGlobalId.substring(delimiterPos + (delimiter || DELIMITER).length),
        };
    }
    else {
        return {
            type: '',
            id: globalId,
        };
    }
}
exports.fromGlobalId = fromGlobalId;
function toGlobalId(type, id, delimiter) {
    const ub = unbase64_1.default(id);
    if (ub.indexOf(delimiter || DELIMITER) !== -1) {
        id = fromGlobalId(id).id;
    }
    return base64_1.default([type, id].join(delimiter || DELIMITER));
}
exports.toGlobalId = toGlobalId;
//# sourceMappingURL=globalIds.js.map