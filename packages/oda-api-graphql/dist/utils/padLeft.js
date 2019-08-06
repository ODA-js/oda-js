"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function padLeft(value, padding) {
    if (typeof padding === 'number') {
        return Array(padding + 1).join(' ') + value;
    }
    if (typeof padding === 'string') {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
exports.default = padLeft;
//# sourceMappingURL=padLeft.js.map