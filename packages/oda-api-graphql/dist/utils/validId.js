"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
function validId(id) {
    if (id == null)
        return false;
    if (typeof id == 'number') {
        return true;
    }
    if (typeof id == 'string') {
        return id.length == 12 || (id.length == 24 && checkForHexRegExp.test(id));
    }
    if (id.toHexString) {
        return (id.id.length == 12 ||
            (id.id.length == 24 && checkForHexRegExp.test(id.id)));
    }
    if (id.toStirng) {
        return id.length == 12 || (id.length == 24 && checkForHexRegExp.test(id));
    }
    return false;
}
exports.default = validId;
//# sourceMappingURL=validId.js.map