"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
function direction({ orderBy, last, before, first, after, }) {
    const result = {};
    if (orderBy) {
        if (!Array.isArray(orderBy)) {
            orderBy = [orderBy];
        }
        for (let i = 0, len = orderBy.length; i < len; i++) {
            const ob = orderBy[i];
            if (ob.match(/Asc$/)) {
                let fieldName = ob.substring(0, ob.length - 3);
                result[fieldName] = consts_1.DIRECTION.FORWARD;
            }
            else if (ob.match(/Desc$/)) {
                let fieldName = ob.substring(0, ob.length - 4);
                result[fieldName] = consts_1.DIRECTION.BACKWARD;
            }
        }
        if (Object.keys(result).length > 0) {
            result._id = consts_1.DIRECTION.FORWARD;
        }
    }
    else {
        if (last || before) {
            result._id = consts_1.DIRECTION.BACKWARD;
        }
        else if (first || after) {
            result._id = consts_1.DIRECTION.FORWARD;
        }
    }
    return result;
}
exports.default = direction;
//# sourceMappingURL=direction.js.map