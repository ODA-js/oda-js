"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function mergeAll(srcValue, dstValue) {
    if (lodash_1.isArray(dstValue)) {
        if (srcValue !== undefined && srcValue !== null) {
            return dstValue.concat(srcValue);
        }
    }
    if (dstValue === null) {
        return dstValue;
    }
}
function deepMerge(...args) {
    if (args.length > 2) {
        return deepMerge(args[0], deepMerge(...args.slice(1)));
    }
    else if (args.length === 2) {
        return _deepMerge(args[0], args[1]);
    }
    else if (args.length === 1) {
        return args[0];
    }
}
exports.default = deepMerge;
function _deepMerge(src, dst) {
    return lodash_1.mergeWith(dst, src, mergeAll);
}
//# sourceMappingURL=deepMerge.js.map