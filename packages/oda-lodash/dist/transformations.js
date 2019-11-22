"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
const lodash_3 = require("lodash");
const lodash_4 = require("lodash");
const lodash_5 = require("lodash");
const lodash_6 = require("lodash");
const lodash_7 = require("lodash");
const lodash_8 = require("lodash");
const lodash_9 = require("lodash");
const lodash_10 = require("lodash");
const lodash_11 = require("lodash");
const lodash_12 = require("lodash");
const lodash_13 = require("lodash");
const lodash_14 = require("lodash");
const lodash_15 = require("lodash");
const lodash_16 = require("lodash");
const lodash_17 = require("lodash");
const lodash_18 = require("lodash");
const lodash_19 = require("lodash");
const lodash_20 = require("lodash");
const lodash_21 = require("lodash");
const lodash_22 = require("lodash");
const lodash_23 = require("lodash");
const lodash_24 = require("lodash");
const lodash_25 = require("lodash");
const lodash_26 = require("lodash");
const lodash_27 = require("lodash");
const lodash_28 = require("lodash");
const lodash_29 = require("lodash");
const lodash_30 = require("lodash");
const lodash_31 = require("lodash");
const lodash_32 = require("lodash");
const lodash_33 = require("lodash");
const lodash_34 = require("lodash");
const lodash_35 = require("lodash");
const lodash_36 = require("lodash");
const lodash_37 = require("lodash");
const lodash_38 = require("lodash");
const lodash_39 = require("lodash");
const lodash_40 = require("lodash");
const lodash_41 = require("lodash");
const lodash_42 = require("lodash");
const lodash_43 = require("lodash");
const lodash_44 = require("lodash");
const lodash_45 = require("lodash");
const lodash_46 = require("lodash");
function getType(v) {
    return Object.prototype.toString
        .call(v)
        .match(/\[object (.+)\]/)[1]
        .toLowerCase();
}
const transformations = {
    array: {
        each: (array, arg) => {
            return lodash_10.map(array, item => applyTransformations(item, arg));
        },
        map: lodash_10.map,
        keyBy: lodash_11.keyBy,
        chunk: lodash_12.chunk,
        drop: lodash_13.drop,
        dropRight: lodash_14.dropRight,
        take: lodash_15.take,
        takeRight: lodash_16.takeRight,
        flattenDepth: lodash_17.flattenDepth,
        fromPairs: lodash_18.fromPairs,
        nth: lodash_19.nth,
        reverse: lodash_20.reverse,
        uniq: lodash_21.uniq,
        uniqBy: lodash_22.uniqBy,
        countBy: lodash_23.countBy,
        filter: lodash_24.filter,
        reject: lodash_25.reject,
        filterIf: (array, arg) => {
            return lodash_24.filter(array, item => applyTransformations(item, arg));
        },
        rejectIf: (array, arg) => {
            return lodash_25.reject(array, item => applyTransformations(item, arg));
        },
        groupBy: lodash_26.groupBy,
        sortBy: lodash_27.sortBy,
        minBy: lodash_28.minBy,
        maxBy: lodash_29.maxBy,
        meanBy: lodash_30.meanBy,
        sumBy: lodash_31.sumBy,
        join: lodash_32.join,
        concat: (src, args) => (obj, key) => {
            debugger;
            lodash_36.set(obj, key, lodash_33.concat(src, lodash_35.get(obj, args)));
            lodash_37.unset(obj, args);
        },
        compact: lodash_34.compact,
    },
    object: {
        get: lodash_35.get,
        assign: (src, args) => (Array.isArray(args) ? args : [args]).reduce((obj, path) => {
            const source = lodash_35.get(obj, path);
            if (source && typeof source === 'object') {
                return lodash_46.omit(lodash_38.assign(obj, lodash_35.get(obj, path)), path);
            }
            else {
                return obj;
            }
        }, src),
        mapValues: lodash_39.mapValues,
        at: lodash_40.at,
        toPairs: lodash_41.toPairs,
        invert: lodash_42.invert,
        invertBy: lodash_43.invertBy,
        keys: lodash_44.keys,
        values: lodash_45.values,
    },
    number: {
        lt: lodash_5.lt,
        lte: lodash_6.lte,
        gt: lodash_7.gt,
        gte: lodash_8.gte,
        eq: lodash_9.eq,
    },
    string: {
        startsWith: lodash_3.startsWith,
        endsWith: lodash_4.endsWith,
        match: (src, args) => {
            return src.match(new RegExp(args.match, args.flags));
        },
        isMatch: (src, args) => {
            return new RegExp(args.match, args.flags).test(src);
        },
        toJSON: (str) => {
            return JSON.parse(str);
        },
    },
    '*': {
        stringify: (src) => {
            return JSON.stringify(src);
        },
        trim: (src) => {
            if (typeof src === 'string') {
                return src.trim();
            }
            else {
                if (typeof src === 'function') {
                    return (...args) => {
                        const result = src(...args);
                        if (typeof result === 'string') {
                            return result.trim();
                        }
                        else {
                            return result;
                        }
                    };
                }
                else {
                    return src;
                }
            }
        },
        convert: (obj, type) => {
            if (obj !== null || obj !== undefined) {
                switch (type) {
                    case 'toNumber':
                        return parseFloat(obj);
                    case 'toString':
                        return obj.toString();
                    default:
                }
            }
            else {
                switch (type) {
                    case 'toNumber':
                        return NaN;
                    case 'toString':
                        return '';
                    default:
                }
            }
        },
        dive: (src, args) => (obj, key) => {
            lodash_37.unset(obj, key);
            lodash_36.set(obj, args, src);
        },
    },
};
const opToExpectedType = (trans => {
    let result = {};
    for (const type in trans) {
        if (trans.hasOwnProperty(type)) {
            const names = trans[type];
            for (const name in names) {
                if (names.hasOwnProperty(name)) {
                    result[name] = type;
                }
            }
        }
    }
    return result;
})(transformations);
function applyTransformations(object, args) {
    if (!args || object === null || object === undefined) {
        return object;
    }
    for (const op in args) {
        if (args.hasOwnProperty(op)) {
            const arg = args[op];
            if (op === 'and') {
                object = lodash_1.every(arg, predicateArgs => applyTransformations(object, predicateArgs));
                continue;
            }
            if (op === 'or') {
                object = lodash_2.some(arg, predicateArgs => applyTransformations(object, predicateArgs));
                continue;
            }
            const expectedType = opToExpectedType[op];
            if (!(object === undefined || object === null)) {
                let type = getType(object);
                if (expectedType !== '*' &&
                    expectedType !== type &&
                    type !== undefined) {
                    throw Error(`"${op}" transformation expect "${expectedType}" but got "${type}"`);
                }
            }
            object = transformations[expectedType][op](object, arg);
        }
    }
    return object === undefined ? null : object;
}
exports.applyTransformations = applyTransformations;
//# sourceMappingURL=transformations.js.map