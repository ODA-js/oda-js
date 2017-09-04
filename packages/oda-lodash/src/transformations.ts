import * as every from 'lodash/every.js';
import * as some from 'lodash/some.js';
import * as startsWith from 'lodash/startsWith.js';
import * as endsWith from 'lodash/endsWith.js';
import * as lt from 'lodash/lt.js';
import * as lte from 'lodash/lte.js';
import * as gt from 'lodash/gt.js';
import * as gte from 'lodash/gte.js';
import * as eq from 'lodash/eq.js';
import * as map from 'lodash/map.js';
import * as keyBy from 'lodash/keyBy.js';
import * as chunk from 'lodash/chunk.js';
import * as drop from 'lodash/drop.js';
import * as dropRight from 'lodash/dropRight.js';
import * as take from 'lodash/take.js';
import * as takeRight from 'lodash/takeRight.js';
import * as flattenDepth from 'lodash/flattenDepth.js';
import * as fromPairs from 'lodash/fromPairs.js';
import * as nth from 'lodash/nth.js';
import * as reverse from 'lodash/reverse.js';
import * as uniq from 'lodash/uniq.js';
import * as uniqBy from 'lodash/uniqBy.js';
import * as countBy from 'lodash/countBy.js';
import * as filter from 'lodash/filter.js';
import * as reject from 'lodash/reject.js';
import * as groupBy from 'lodash/groupBy.js';
import * as sortBy from 'lodash/sortBy.js';
import * as minBy from 'lodash/minBy.js';
import * as maxBy from 'lodash/maxBy.js';
import * as meanBy from 'lodash/meanBy.js';
import * as sumBy from 'lodash/sumBy.js';
import * as join from 'lodash/join.js';

import * as get from 'lodash/get.js';
import * as set from 'lodash/set.js';
import * as unset from 'lodash/unset.js';
import * as assign from 'lodash/assign.js';
import * as mapValues from 'lodash/mapValues.js';
import * as at from 'lodash/at.js';
import * as toPairs from 'lodash/toPairs.js';
import * as invert from 'lodash/invert.js';
import * as invertBy from 'lodash/invertBy.js';
import * as keys from 'lodash/keys.js';
import * as values from 'lodash/values.js';
import * as omit from "lodash/omit.js";

export function applyTransformations(object, args) {
  if (!args)
    return object;

  for (const op in args) {
    // if (object === null)
    //   break;

    const arg = args[op];

    if (op === 'and') {
      object = every(arg, predicateArgs => applyTransformations(object, predicateArgs));
      continue;
    }
    if (op === 'or') {
      object = some(arg, predicateArgs => applyTransformations(object, predicateArgs));
      continue;
    }

    const expectedType = opToExpectedType[op];
    let type = object && object.constructor && object.constructor.name;
    // handle objects created with Object.create(null)
    if (!type && (typeof object === 'object'))
      type = 'Object';

    if (expectedType !== '*' && expectedType !== type && type !== undefined)
      throw Error(`"${op}" transformation expect "${expectedType}" but got "${type}"`);

    object = transformations[expectedType][op](object, arg);
  }
  return object;
}

const transformations = {
  Array: {
    each: (array, arg) => {
      return map(array, item => applyTransformations(item, arg));
    },
    map,
    keyBy,
    chunk,
    drop,
    dropRight,
    take,
    takeRight,
    flattenDepth,
    fromPairs,
    nth,
    reverse,
    uniq,
    uniqBy,
    countBy,
    filter,
    reject,
    filterIf: (array, arg) => {
      return filter(array, item => applyTransformations(item, arg));
    },
    rejectIf: (array, arg) => {
      return reject(array, item => applyTransformations(item, arg));
    },
    groupBy,
    sortBy,
    minBy,
    maxBy,
    meanBy,
    sumBy,
    join,
  },
  Object: {
    get,
    assign: (src, args) => args.reduce((obj, path) => {
      const source = get(obj, path);
      if (source && typeof source === 'object') {
        return omit(assign(obj, get(obj, path)), path);
      } else {
        return obj;
      }
    }, src),
    mapValues,
    at,
    toPairs,
    invert,
    invertBy,
    keys,
    values,
  },
  Number: {
    lt,
    lte,
    gt,
    gte,
    eq,
  },
  String: {
    startsWith,
    endsWith,
  },
  "*": {
    dive: (src, args) => (obj, key) => {
      unset(obj, key);
      set(obj, args, src);
    },
  }
};

const opToExpectedType = ((transformations) => {
  let result = {};
  for (const type in transformations) {
    for (const name in transformations[type]) {
      result[name] = type;
    }
  }
  return result;
})(transformations)