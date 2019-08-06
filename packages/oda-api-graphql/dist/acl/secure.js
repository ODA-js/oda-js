"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secureField_1 = __importDefault(require("./secureField"));
const secureMethod_1 = __importDefault(require("./secureMethod"));
exports.default = obj => {
    if (typeof obj === 'object') {
        return secureField_1.default(obj);
    }
    else if (typeof obj === 'function') {
        return secureMethod_1.default(obj);
    }
    return obj;
};
//# sourceMappingURL=secure.js.map