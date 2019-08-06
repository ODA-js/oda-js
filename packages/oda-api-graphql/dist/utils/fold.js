"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = __importDefault(require("./set"));
const fold = data => {
    if (Array.isArray(data)) {
        const result = [];
        for (let i = 0, len = data.length; i < len; i++) {
            result.push(fold(data[i]));
        }
        return result;
    }
    else if (data instanceof Object) {
        let result = {};
        let keys = Object.keys(data);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let d = data[key];
            set_1.default(result, key, d instanceof Object ? fold(d) : d);
        }
        return result;
    }
};
exports.default = fold;
//# sourceMappingURL=fold.js.map