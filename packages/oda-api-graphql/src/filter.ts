import { fromGlobalId } from './globalId';

import validId from './utils/validId';

export function getValue(value, idMap, id) {
  if (id) {
    if (Array.isArray(value)) {
      return value.map(v => getValue(v, idMap, id));
    } if (typeof value === 'string') {
      return validId(value) ? value : fromGlobalId(value).id;
    } else {
      return value;
    }
  } else {
    return value;
  }
}

export class Filter {
  private static operations = {
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
  };
  public static parse(node, idMap = { id: '_id' }, id: boolean = false) {
    if (Array.isArray(node)) {
      return node.map(n => Filter.parse(n, idMap, id));
    } if (typeof node === 'object' && (node.constructor === Object || node.constructor === undefined)) {
      let result = {};
      let keys = Object.keys(node);
      keys.forEach((key, index) => {
        if (Filter.operations.hasOwnProperty(key)) {
          result = {
            ...result,
            ...Filter.operations[key](node[key], idMap, id),
          };
        } else {
          let idKey = idMap.hasOwnProperty(key);
          result[idKey ? idMap[key] : key] = Filter.parse(node[key], idMap, idKey);
        }
      });
      return result;
    } else {
      return Filter.operations.eq(node, idMap, id);
    }
  }
}

export class FilterSequelize {
  private static operations = {
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
      return { $regexp: value };
    },
    imatch(value, idMap, id) {
      if (typeof value !== 'string') {
        throw new Error('expected string type for imatch operation');
      }
      return { $iRegexp: value };
    },
  };
  public static parse(node, idMap = {}, id: boolean = false) {
    if (Array.isArray(node)) {
      return node.map(n => FilterSequelize.parse(n, idMap, id));
    } if (typeof node === 'object' && (node.constructor === Object || node.constructor === undefined)) {
      let result = {};
      let keys = Object.keys(node);
      keys.forEach((key, index) => {
        if (FilterSequelize.operations.hasOwnProperty(key)) {
          result = {
            ...result,
            ...FilterSequelize.operations[key](node[key], idMap, id),
          };
        } else {
          let idKey = idMap.hasOwnProperty(key);
          result[idKey ? idMap[key] : key] = FilterSequelize.parse(node[key], idMap, idKey);
        }
      });
      return result;
    } else {
      return FilterSequelize.operations.eq(node, idMap, id);
    }
  }
}

export class Process {
  private static operations = {
    eq(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf == ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} == ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    gt(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf > ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} > ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    gte(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf >= ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} >= ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    lt(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf < ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} < ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    lte(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf <= ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} <= ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    ne(value, idMap, id) {
      if (value instanceof Date) {
        return `value.valueOf !== ${value.valueOf()}`;
      } else {
        return `value${id ? '.toString()' : ''} !== ${JSON.stringify(getValue(value, idMap, id))}`;
      }
    },
    in(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) !== -1`;
      } else {
        return `${JSON.stringify(value)}.indexOf(value${id ? '.toString()' : ''}) !== -1`;
      }
    },
    nin(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) === -1`;
      } else {
        return `${JSON.stringify(id ? value.map(v => v.toString()) : value)}.indexOf(value${id ? '.toString()' : ''}) === -1`;
      }
    },
    contains(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `value.indexOf(${JSON.stringify(value.valueOf())}) !== -1`;
      } else {
        return `value.indexOf(${JSON.stringify(value)}) !== -1`;
      }
    },
    some(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `value.some(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) !== -1))`;
      } else {
        return `value.some(i => (${JSON.stringify(value)}.indexOf(i) !== -1))`;
      }
    },
    every(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `value.every(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) !== -1))`;
      } else {
        return `value.every(i => (${JSON.stringify(value)}.indexOf(i) !== -1))`;
      }
    },
    except(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `value.indexOf(${JSON.stringify(value.valueOf())}) === -1`;
      } else {
        return `value.indexOf(${JSON.stringify(value)}) === -1`;
      }
    },
    none(value, idMap, id) {
      if (value[0] instanceof Date) {
        return `value.every(i => (${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(i) === -1))`;
      } else {
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

  public static create(obj, idMap: { [key: string]: any } = { id: '_id' }) {
    let filter = Process.go(obj, idMap);
    // tslint:disable-next-line:no-eval
    return eval(`(value)=>${filter.join('&&') || 'true'}`);
  }

  private static go(node: object[] | object, idMap: { [key: string]: any } = { id: '_id' }, id: boolean = false, result?) {
    if (Array.isArray(node)) {
      return node.map(n => Process.go(n, idMap, id, result));
    } else if (typeof node === 'object' && (node.constructor === Object || node.constructor === undefined)) {
      if (!result) {
        result = [];
      }
      let keys = Object.keys(node);
      keys.forEach((key, index) => {
        if (Process.operations.hasOwnProperty(key)) {
          result.push(Process.operations[key](node[key], idMap, id));
        } else {
          let idKey = idMap.hasOwnProperty(key);
          result.push(`((value)=>${Process.go(node[key], idMap, idKey)})(value.${idKey ? idMap[key] : key})`);
        }
      });
      return result;
    } else {
      return Process.operations.eq(node, idMap, id);
    }
  }

}

export function withContext(subscriptionHandler, idMap: { [key: string]: any } = { id: '_id' }) {
  return (root, args, context, info) => {
    return subscriptionHandler(root, args, {
      queryCheck: Process.create(args.filter || {}, idMap),
      ...context,
    }, info);
  };
}
