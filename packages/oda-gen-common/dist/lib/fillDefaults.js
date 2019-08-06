"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function mergeAll(srcValue, dstValue) {
    if (lodash_1.isArray(dstValue)) {
        return dstValue;
    }
    if (dstValue === null) {
        return dstValue;
    }
}
function override(...args) {
    if (args.length > 2) {
        return override(args[0], override(...args.slice(1)));
    }
    else if (args.length === 2) {
        return _override(args[0], args[1]);
    }
    else if (args.length === 1) {
        return args[0];
    }
}
exports.default = override;
function _override(src, dst) {
    if (dst !== null) {
        return lodash_1.mergeWith(src, dst, mergeAll);
    }
    else {
        return null;
    }
}
//# sourceMappingURL=fillDefaults.js.map