"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_api_graphql_1 = require("oda-api-graphql");
const getValue = oda_api_graphql_1.Filter.getValue;
class FilterSequelize {
    static parse(node, idMap = {}, id = false) {
        if (Array.isArray(node)) {
            return node.map(n => FilterSequelize.parse(n, idMap, id));
        }
        if (typeof node === 'object' &&
            (node.constructor === Object || node.constructor === undefined)) {
            let result = {};
            let keys = Object.keys(node);
            keys.forEach((key, index) => {
                if (FilterSequelize.operations.hasOwnProperty(key)) {
                    result = Object.assign({}, result, FilterSequelize.operations[key](node[key], idMap, id));
                }
                else {
                    let idKey = idMap.hasOwnProperty(key);
                    result[idKey ? idMap[key] : key] = FilterSequelize.parse(node[key], idMap, idKey);
                }
            });
            return result;
        }
        else {
            return FilterSequelize.operations.eq(node, idMap, id);
        }
    }
}
FilterSequelize.operations = {
    eq(value, idMap, id) {
        return { $eq: getValue(value, idMap, id) };
    },
    gt(value, idMap, id) {
        return { $gt: getValue(value, idMap, id) };
    },
    gte(value, idMap, id) {
        return { $gte: getValue(value, idMap, id) };
    },
    lt(value, idMap, id) {
        return { $lt: getValue(value, idMap, id) };
    },
    lte(value, idMap, id) {
        return { $lte: getValue(value, idMap, id) };
    },
    ne(value, idMap, id) {
        return { $ne: getValue(value, idMap, id) };
    },
    in(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for in operation');
        }
        return { $in: getValue(value, idMap, id) };
    },
    nin(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for nin operation');
        }
        return { $nin: getValue(value, idMap, id) };
    },
    or(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for or operation');
        }
        return { $or: FilterSequelize.parse(value, idMap, id) };
    },
    and(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for and operation');
        }
        return { $and: FilterSequelize.parse(value, idMap, id) };
    },
    nor(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for nor operation');
        }
        return { $nor: FilterSequelize.parse(value, idMap, id) };
    },
    not(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for not operation');
        }
        return { $not: FilterSequelize.parse(value, idMap, id) };
    },
    exists(value, idMap, id) {
        if (typeof value !== 'boolean') {
            throw new Error('expected boolean type for exists operation');
        }
        return { $exists: value };
    },
    match(value, idMap, id) {
        if (typeof value !== 'string') {
            throw new Error('expected string type for match operation');
        }
        return { $like: `${value}%` };
    },
    imatch(value, idMap, id) {
        if (typeof value !== 'string') {
            throw new Error('expected string type for imatch operation');
        }
        return { $like: `${value}%` };
    },
    query(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return oda_api_graphql_1.Filter.Filter.parse(value, idMap, id);
    },
};
exports.FilterSequelize = FilterSequelize;
//# sourceMappingURL=filter.js.map