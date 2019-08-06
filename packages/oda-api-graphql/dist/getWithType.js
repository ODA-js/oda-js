"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (promise, type) => {
    return promise.then(result => {
        if (result !== undefined && result !== null) {
            result.__type__ = type;
        }
        return result;
    });
};
//# sourceMappingURL=getWithType.js.map