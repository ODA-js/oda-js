"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
const lodash_3 = require("lodash");
const lodash_4 = require("lodash");
function sameId(a, b) {
    return a.id === b.id;
}
function default_1(data, previousData, field, resources) {
    const name = field.name;
    const embedded = field.ref && field.ref.embedded;
    const value = data[name];
    const prev = previousData[name];
    if (!lodash_3.isEqual(value, prev)) {
        if (embedded) {
            return { [`${name}`]: data[name] };
        }
        else if (!value.some(f => lodash_4.isPlainObject(f))) {
            const removed = lodash_1.difference(previousData[name], data[name]).map(f => ({
                id: f,
            }));
            const inserted = lodash_1.difference(data[name], previousData[name]).map(f => ({
                id: f,
            }));
            return {
                [`${name}`]: inserted,
                [`${name}Unlink`]: removed,
            };
        }
        else {
            const removed = lodash_2.differenceBy(previousData[name], data[name], 'id').map(f => ({
                id: f,
            }));
            const newItems = lodash_2.differenceBy(data[name], previousData[name], 'id');
            const created = newItems.filter(f => !f.hasOwnProperty('id'));
            const inserted = newItems.filter(f => f.hasOwnProperty('id'));
            return {
                [`${name}`]: inserted,
                [`${name}Unlink`]: removed,
                [`${name}Create`]: created,
            };
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=updateMany.js.map