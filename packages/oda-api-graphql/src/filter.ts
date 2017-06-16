import { fromGlobalId } from 'graphql-relay';

function getValue(value, id) {
  if (id) {
    if (Array.isArray(value)) {
      return value.map(v => getValue(v, id))
    } else {
      return fromGlobalId(value).id;
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
    } if (typeof node === 'object') {
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
      return node;
    }
  }
}
