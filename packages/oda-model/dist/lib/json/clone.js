"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("./clean"));
function clone(obj) {
    return JSON.parse(JSON.stringify(clean_1.default(obj)));
}
exports.default = clone;
//# sourceMappingURL=clone.js.map