"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secureMethod_1 = __importDefault(require("./secureMethod"));
exports.default = typeResolver => {
    if (typeof typeResolver.resolve === 'function') {
        typeResolver.resolve = secureMethod_1.default(typeResolver.resolve);
    }
    return typeResolver;
};
//# sourceMappingURL=secureField.js.map