"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function default_1(data, field, resources) {
    const value = data[field.name];
    if (value !== undefined && Array.isArray(value) && value.length > 0) {
        if (!value.some(f => lodash_1.isPlainObject(f))) {
            return {
                [field.name]: data[field.name].map((f) => ({ id: f })),
            };
        }
        else {
            return {
                [field.name]: data[field.name].map((value) => resources
                    .queries(field.ref.resource, 'CREATE')
                    .variables({ data: value }).input),
            };
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=createMany.js.map