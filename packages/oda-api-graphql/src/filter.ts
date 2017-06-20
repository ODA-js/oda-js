import { fromGlobalId } from 'graphql-relay';

export function getValue(value, id) {
  if (id) {
    if (Array.isArray(value)) {
      return value.map(v => getValue(v, id))
    } if (typeof value === 'string') {
      return fromGlobalId(value).id;
    } else {
      return value;
    }
  } else {
    return value;
  }
}

export class Filter {
  static operations = {
    eq(value, id) {
      return { $eq: getValue(value, id) }
    },
    gt(value, id) {
      return { $gt: getValue(value, id) }
    },
    gte(value, id) {
      return { $gte: getValue(value, id) }
    },
    lt(value, id) {
      return { $lt: getValue(value, id) }
    },
    lte(value, id) {
      return { $lte: getValue(value, id) }
    },
    ne(value, id) {
      return { $ne: getValue(value, id) }
    },
    in(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for in operation');
      }
      return { $in: getValue(value, id) }
    },
    nin(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for nin operation');
      }
      return { $nin: getValue(value, id) }
    },
    or(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for or operation');
      }
      return { $or: Filter.parse(value, id) }
    },
    and(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for and operation');
      }
      return { $and: Filter.parse(value, id) }
    },
    nor(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for nor operation');
      }
      return { $nor: Filter.parse(value, id) }
    },
    not(value, id) {
      if (!Array.isArray(value)) {
        throw new Error('expected array type for not operation');
      }
      return { $not: Filter.parse(value, id) }
    },
    exists(value, id) {
      if (typeof value !== 'boolean') {
        throw new Error('expected boolean type for exists operation');
      }
      return { $exists: value }
    },
    match(value, id) {
      if (typeof value !== 'string') {
        throw new Error('expected string type for exists operation');
      }
      return { $regex: new RegExp(value) }
    }
  }
  public static parse(node, id: boolean = false) {
    if (Array.isArray(node)) {
      return node.map(n => Filter.parse(n, id));
    } if (typeof node === 'object' && (node.constructor === Object || node.constructor === undefined)) {
      let result = {};
      let keys = Object.keys(node);
      keys.forEach((key, index) => {
        if (Filter.operations.hasOwnProperty(key)) {
          result = {
            ...result,
            ...Filter.operations[key](node[key], id)
          };
        } else {
          result[key == 'id' ? '_id' : key] = Filter.parse(node[key], key === 'id');
        }
      });
      return result;
    } else {
      return Filter.operations.eq(node, id);
    }
  }
}

export class Process {
  static operations = {
    eq(value, id) {
      if (value instanceof Date) {
        return `value.valueOf == ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} == ${JSON.stringify(getValue(value, id))}`
      }
    },
    gt(value, id) {
      if (value instanceof Date) {
        return `value.valueOf > ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} > ${JSON.stringify(getValue(value, id))}`
      }
    },
    gte(value, id) {
      if (value instanceof Date) {
        return `value.valueOf >= ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} >= ${JSON.stringify(getValue(value, id))}`
      }
    },
    lt(value, id) {
      if (value instanceof Date) {
        return `value.valueOf < ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} < ${JSON.stringify(getValue(value, id))}`
      }
    },
    lte(value, id) {
      if (value instanceof Date) {
        return `value.valueOf <= ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} <= ${JSON.stringify(getValue(value, id))}`
      }
    },
    ne(value, id) {
      if (value instanceof Date) {
        return `value.valueOf !== ${value.valueOf()}`
      } else {
        return `value${id ? '.toString()' : ''} !== ${JSON.stringify(getValue(value, id))}`
      }
    },
    in(value, id) {
      if (value[0] instanceof Date) {
        return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) !== -1`;
      } else {
        return `${JSON.stringify(value)}.indexOf(value${id ? '.toString()' : ''}) !== -1`;
      }
    },
    nin(value, id) {
      if (value[0] instanceof Date) {
        return `${JSON.stringify(value.map(v => v.valueOf()))}.indexOf(value) === -1`;
      } else {
        return `${JSON.stringify(id ? value.map(v => v.toString()) : value)}.indexOf(value${id ? '.toString()' : ''}) === -1`;
      }
    },
    or(value, id) {
      return '(' + value.map(v => `(${Process.go(v)})`).join('||') + ')';
    },
    and(value, id) {
      return '(' + value.map(v => `(${Process.go(v)})`).join('&&') + ')';
    },
    nor(value, id) {
      return '!(' + value.map(v => `(${Process.go(v)})`).join('||') + ')';
    },
    not(value, id) {
      return '!(' + value.map(v => `(${Process.go(v)})`).join('&&') + ')';
    },
    exists(value, id) {
      return `${value ? '' : '!'}(value! == undefined || value!== null || value!== '')`;
    },
    match(value, id) {
      return `(new RegExp(${value})).test(value.toString())`;
    }
  }

  private static go(node: object[] | object, id: boolean = false, result?) {
    if (Array.isArray(node)) {
      return node.map(n => Process.go(n, id, result));
    } else if (typeof node === 'object' && (node.constructor === Object || node.constructor === undefined)) {
      if (!result) {
        result = [];
      }
      let keys = Object.keys(node);
      keys.forEach((key, index) => {
        if (Process.operations.hasOwnProperty(key)) {
          result.push(Process.operations[key](node[key], id));
        } else {
          result.push(`((value)=>${Process.go(node[key], key === 'id')})(v.${key === 'id' ? '_id' : key})`);
        }
      });
      return result;
    } else {
      return Process.operations.eq(node, id);
    }
  }
  public static create(obj) {
    let filter = Process.go(obj);
    return eval(`(v)=>${filter.join('&&') || 'true'}`);
  }
}

export function withContext(subscriptionHandler) {
  return (root, args, context, info) => {
    return subscriptionHandler(root, args, {
      queryCheck: Process.create(args.filter || {}),
      ...context
    }, info);
  }
}
