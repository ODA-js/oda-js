"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
const lodash_3 = require("lodash");
function default_1(data, previousData, field, resources) {
    const name = field.name;
    const embedded = field.ref && field.ref.embedded;
    const value = data[name];
    const prev = previousData[name];
    if (!lodash_2.isEqual(value, prev)) {
        if (embedded) {
            return { [`${name}`]: data[name] };
        }
        else if (!lodash_1.isPlainObject(value)) {
            return {
                [name]: { id: value },
            };
        }
        else {
            if (data.hasOwnProperty('id') && !lodash_3.isNil(data['id'])) {
                return {
                    [name]: resources.queries(field.ref.resource, 'UPDATE').variables({
                        data: data[name],
                        previousData: previousData[name] || {},
                    }).input,
                    [`${name}Unlink`]: {
                        id: prev ? prev[name] : undefined,
                    },
                };
            }
            else {
                return {
                    [`${name}Create`]: resources
                        .queries(field.ref.resource, 'CREATE')
                        .variables({
                        data: data[name],
                    }).input,
                };
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=updateSingle.js.map