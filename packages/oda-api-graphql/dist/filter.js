"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_isomorfic_1 = require("oda-isomorfic");
const validId_1 = __importDefault(require("./utils/validId"));
function getValue(value, idMap, id) {
    if (id) {
        if (Array.isArray(value)) {
            return value.map(v => getValue(v, idMap, id));
        }
        else if (typeof value === 'string') {
            return validId_1.default(value) ? value : oda_isomorfic_1.fromGlobalId(value).id;
        }
        else {
            return value;
        }
    }
    else {
        return value;
    }
}
exports.getValue = getValue;
class Filter {
    static parse(node, idMap = { id: '_id' }, id = false) {
        if (Array.isArray(node)) {
            return node.map(n => Filter.parse(n, idMap, id));
        }
        if (typeof node === 'object' &&
            (node.constructor === Object || node.constructor === undefined)) {
            let result = {};
            let keys = Object.keys(node);
            keys.forEach((key, index) => {
                if (Filter.operations.hasOwnProperty(key)) {
                    result = Object.assign({}, result, Filter.operations[key](node[key], idMap, id));
                }
                else {
                    let idKey = idMap.hasOwnProperty(key);
                    result[idKey ? idMap[key] : key] = Filter.parse(node[key], idMap, idKey);
                }
            });
            return result;
        }
        else {
            return Filter.operations.eq(node, idMap, id);
        }
    }
}
Filter.types = {
    $eq: 'scalar',
    $all: 'scalar',
    $gt: 'scalar',
    $gtq: 'scalar',
    $lt: 'scalar',
    $lte: 'scalar',
    $ne: 'scalar',
    $in: 'scalar',
    $nin: 'scalar',
    $size: 'scalar',
    $or: 'array',
    $and: 'array',
    $nor: 'array',
    $not: 'array',
    $regex: 'string',
    $exists: 'boolean',
    $geometry: 'scalar',
    $maxDistance: 'scalar',
    $minDistance: 'scalar',
    $geoIntersects: 'scalar',
    $geoWithin: 'scalar',
    $near: 'scalar',
    $nearSphere: 'scalar',
    $box: 'scalar',
    $center: 'scalar',
    $centerSphere: 'scalar',
    $polygon: 'scalar',
};
Filter.operations = {
    eq(value, idMap, id) {
        return { $eq: getValue(value, idMap, id) };
    },
    all(value, idMap, id) {
        return { $all: getValue(value, idMap, id) };
    },
    size(value, idMap, id) {
        return { $size: getValue(value, idMap, id) };
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
        return { $or: Filter.parse(value, idMap, id) };
    },
    and(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for and operation');
        }
        return { $and: Filter.parse(value, idMap, id) };
    },
    nor(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for nor operation');
        }
        return { $nor: Filter.parse(value, idMap, id) };
    },
    not(value, idMap, id) {
        if (!Array.isArray(value)) {
            throw new Error('expected array type for not operation');
        }
        return { $not: Filter.parse(value, idMap, id) };
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
        return { $regex: new RegExp(value) };
    },
    imatch(value, idMap, id) {
        if (typeof value !== 'string') {
            throw new Error('expected string type for imatch operation');
        }
        return { $regex: new RegExp(value, 'i') };
    },
    query(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return Filter.parse(value, idMap, id);
    },
    geometry(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        if (!value.type || !value.coordinates) {
            throw new Error('expected GeoJSON type for exists operation');
        }
        return { $geometry: value };
    },
    maxDistance(value, idMap, id) {
        if (typeof value !== 'number') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $maxDistance: value };
    },
    minDistance(value, idMap, id) {
        if (typeof value !== 'number') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $minDistance: value };
    },
    geoIntersects(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $geoIntersects: Filter.parse(value, idMap, id) };
    },
    geoWithin(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $geoWithin: Filter.parse(value, idMap, id) };
    },
    near(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $near: Filter.parse(value, idMap, id) };
    },
    nearSphere(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $nearSphere: Filter.parse(value, idMap, id) };
    },
    box(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $box: Filter.parse(value, idMap, id) };
    },
    center(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $center: Filter.parse(value, idMap, id) };
    },
    centerSphere(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $centerSphere: Filter.parse(value, idMap, id) };
    },
    polygon(value, idMap, id) {
        if (typeof value !== 'object') {
            throw new Error('expected JSON type for exists operation');
        }
        return { $polygon: Filter.parse(value, idMap, id) };
    },
};
exports.Filter = Filter;
class Process {
    static create(obj, idMap = { id: '_id' }) {
        let filter = Process.go(obj, idMap);
        return eval(`(value)=>${filter && Array.isArray(filter) ? filter.join('&&') : 'true'}`);
    }
    static go(node, idMap = { id: '_id' }, id = false, result) {
        if (Array.isArray(node)) {
            return node.map(n => Process.go(n, idMap, id, result)).filter(n => n);
        }
        else if (typeof node === 'object' &&
            (node.constructor === Object || node.constructor === undefined)) {
            if (!result) {
                result = [];
            }
            let keys = Object.keys(node);
            keys.forEach((key, index) => {
                if (Process.operations.hasOwnProperty(key)) {
                    result.push(Process.operations[key](node[key], idMap, id));
                }
                else if (!Process.skip[key]) {
                    let idKey = idMap.hasOwnProperty(key);
                    if (key !== '*') {
                        result.push(`((value)=>${Process.go(node[key], idMap, idKey) ||
                            true})(value.${idKey ? idMap[key] : key})`);
                    }
                    else {
                        result.push(`(Object.keys(value).some(key =>(value=>${Process.go(node[key], idMap, idKey) || true})(value[key])))`);
                    }
                }
            });
            return result.length > 0 ? result : undefined;
        }
        else {
            return Process.operations.eq(node, idMap, id);
        }
    }
}
Process.skip = {
    query: true,
    geometry: true,
    maxDistance: true,
    minDistance: true,
    geoIntersects: true,
    geoWithin: true,
    near: true,
    nearSphere: true,
    box: true,
    center: true,
    centerSphere: true,
    polygon: true,
};
Process.operations = {
    eq(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf == ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} == ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    size(value, idMap, id) {
        if (value) {
            return `value.length === ${value}`;
        }
    },
    gt(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf > ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} > ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    gte(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf >= ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} >= ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    lt(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf < ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} < ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    lte(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf <= ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} <= ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    ne(value, idMap, id) {
        if (value instanceof Date) {
            return `value.valueOf !== ${value.valueOf()}`;
        }
        else {
            return `value${id ? '.toString()' : ''} !== ${JSON.stringify(getValue(value, idMap, id))}`;
        }
    },
    in(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) !== -1`;
        }
        else {
            return `${JSON.stringify(value)}.indexOf(value${id ? '.toString()' : ''}) !== -1`;
        }
    },
    nin(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) === -1`;
        }
        else {
            return `${JSON.stringify(id ? value.map(v => v.toString()) : value)}.indexOf(value${id ? '.toString()' : ''}) === -1`;
        }
    },
    contains(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `value.indexOf(${JSON.stringify(value.valueOf())}) !== -1`;
        }
        else {
            return `value.indexOf(${JSON.stringify(value)}) !== -1`;
        }
    },
    some(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `value.some(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) !== -1))`;
        }
        else {
            return `value.some(i => (${JSON.stringify(value)}.indexOf(i) !== -1))`;
        }
    },
    every(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `value.every(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) !== -1))`;
        }
        else {
            return `value.every(i => (${JSON.stringify(value)}.indexOf(i) !== -1))`;
        }
    },
    except(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `value.indexOf(${JSON.stringify(value.valueOf())}) === -1`;
        }
        else {
            return `value.indexOf(${JSON.stringify(value)}) === -1`;
        }
    },
    none(value, idMap, id) {
        if (value[0] instanceof Date) {
            return `value.every(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) === -1))`;
        }
        else {
            return `value.every(i => (${JSON.stringify(value)}.indexOf(i) === -1))`;
        }
    },
    or(value, idMap, id) {
        return '(' + value.map(v => `(${Process.go(v)})`).join('||') + ')';
    },
    and(value, idMap, id) {
        return '(' + value.map(v => `(${Process.go(v)})`).join('&&') + ')';
    },
    nor(value, idMap, id) {
        return '!(' + value.map(v => `(${Process.go(v)})`).join('||') + ')';
    },
    not(value, idMap, id) {
        return '!(' + value.map(v => `(${Process.go(v)})`).join('&&') + ')';
    },
    exists(value, idMap, id) {
        return `${value ? '' : '!'}(value !== undefined && value !== null && value !== '')`;
    },
    match(value, idMap, id) {
        return `(new RegExp("${value}")).test(value.toString())`;
    },
    imatch(value, idMap, id) {
        return `(new RegExp("${value}","i")).test(value.toString())`;
    },
};
exports.Process = Process;
function withContext(subscriptionHandler, idMap = { id: '_id' }) {
    return (root, args, context, info) => {
        return subscriptionHandler(root, args, Object.assign({ queryCheck: Process.create(args.filter || {}, idMap) }, context), info);
    };
}
exports.withContext = withContext;
//# sourceMappingURL=filter.js.map