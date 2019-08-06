"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
function default_1(data, previousData = {}, field) {
    if (!lodash_1.isEqual(data[field], previousData[field])) {
        return {
            [field]: !lodash_2.isNil(data[field]) ? data[field] : null,
        };
    }
}
exports.default = default_1;
//# sourceMappingURL=updateField.js.map