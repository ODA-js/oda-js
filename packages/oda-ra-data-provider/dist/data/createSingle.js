"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function default_1(data, field, resources) {
    const name = field.name;
    const value = data[name];
    if (value !== undefined) {
        if (!lodash_1.isPlainObject(value)) {
            return {
                [name]: { id: value },
            };
        }
        else {
            return {
                [name]: resources
                    .queries(field.ref.resource, 'CREATE')
                    .variables({ data: data[field.name] }).input,
            };
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=createSingle.js.map