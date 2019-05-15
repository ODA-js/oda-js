import { fromGlobalId } from 'oda-isomorfic';
import { set, get } from 'lodash';
import getLogger from 'oda-logger';
let logger = getLogger('oda-api-graphql:api-mongoose');

import {
  ConnectorsApiBase,
  listIterator,
  SecurityContext,
  consts,
  pagination,
  detectCursorDirection,
  Filter as FilterBase,
  RegisterConnectorsBase,
} from 'oda-api-graphql';

const { forward } = listIterator;
const { DIRECTION } = consts;
const { Filter } = FilterBase;

function unfoldQuery(
  obj: any | any[],
  operations: object,
  parent: string[],
  res?: object,
) {
  logger.trace('unfoldQuery');
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => unfoldQuery(item, operations, parent));
    } else {
      if (!res) {
        res = {};
      }
      Object.keys(obj).forEach(key => {
        let setKey = key;
        let index = setKey.match(/^at_(\d*)$/);
        if (index && index[1]) {
          setKey = index[1];
        }
        if (operations.hasOwnProperty(key)) {
          if (operations[key] === 'array') {
            res[key] = unfoldQuery(obj[key], operations, parent);
          } else {
            res[parent.join('.')] = obj;
          }
        } else {
          unfoldQuery(obj[key], operations, [...parent, setKey], res);
        }
      });
      return res;
    }
  } else {
    return obj;
  }
}

export class FilterMongoose {
  public static parse(node, idMap = { id: '_id' }, id: boolean = false) {
    logger.trace('parse %o', node);
    let result = Filter.parse(node, idMap, id);
    if (typeof result === 'object') {
      return unfoldQuery(result, Filter.types, []);
    }
    return result;
  }
}

export default class MongooseApi<
  RegisterConnectors extends RegisterConnectorsBase,
  Payload extends object
> extends ConnectorsApiBase<RegisterConnectors, Payload> {
  public mongoose: any;

  constructor({
    mongoose,
    connectors,
    name,
    securityContext,
  }: {
    mongoose: any;
    name: string;
    connectors: RegisterConnectors;
    securityContext: SecurityContext<RegisterConnectors>;
  }) {
    super({ connectors, securityContext, name });
    this.mongoose = mongoose;
  }

  protected initSchema(name, schema) {
    logger.trace('%s unfoldQuery', name);
    this.schema = schema;
    if (!this.mongoose.models[name]) {
      this.model = this.mongoose.model(name, schema);
    } else {
      this.model = this.mongoose.model(name);
    }
  }
  public async getCount(args) {
    logger.trace('getCount %o', args);
    let query = this.getFilter(args);
    if (query.hasOwnProperty().length > 0) {
      logger.trace('getCount use countDocuments %o', query);
      return await this.model.countDocuments(query);
    } else {
      logger.trace('getCount use estimatedDocumentCount');
      return await this.model.estimatedDocumentCount();
    }
  }

  public getFilter(args: { filter: any; idMap: any }) {
    logger.trace('getFilter %o', args);
    if (args.filter) {
      return FilterMongoose.parse(args.filter, args.idMap);
    } else {
      return {};
    }
  }

  public toJSON(obj): Payload {
    logger.trace('%s toJSON', this.name);
    return super.toJSON(obj && obj.toObject ? obj.toObject() : obj);
  }

  public ensureId(obj) {
    logger.trace('%s ensureId', this.name);
    if (obj) {
      return this.toJSON({
        ...obj,
        id: obj._id,
      } as Payload);
    } else {
      return obj as Payload;
    }
  }

  protected async _getList(args, checkExtraCriteria?) {
    logger.trace('%s _getList', this.name);
    let hasExtraCondition = typeof checkExtraCriteria !== 'undefined';
    let query: any = this.getFilter(args);
    let sort = detectCursorDirection(args);
    let cursor = pagination(args);

    let result = [];

    let move: any = {};

    if (cursor.after || cursor.before) {
      const detect = (name: string, value: any) => ({
        [name]:
          sort[name] === DIRECTION.BACKWARD
            ? { [cursor.after ? '$lt' : '$gt']: value }
            : { [cursor.before ? '$lt' : '$gt']: value },
      });
      let sortKeys = Object.keys(sort);
      if (sortKeys.length > 1) {
        let current = await this.findOneById(cursor.after || cursor.before);
        let find = sortKeys.filter(f => f !== '_id');
        find.push('_id');
        const or = [];
        while (find.length > 0) {
          const len = find.length;
          or.push(
            find.reduce((prev, f, index) => {
              const curr =
                index === len - 1
                  ? detect(f, current[f])
                  : {
                      [f]: { $eq: current[f] },
                    };
              prev = {
                ...prev,
                ...curr,
              };
              return prev;
            }, {}),
          );
          find.pop();
        }
        move = { $or: or };
      } else {
        move = {
          _id: {
            [sort._id === DIRECTION.FORWARD ? '$gt' : '$lt']:
              cursor.after || cursor.before,
          },
        };
      }
    }

    if (Object.keys(query).length > 0) {
      if (Object.keys(move).length > 0) {
        query = {
          $and: [move, query],
        };
      }
    } else {
      if (Object.keys(move).length > 0) {
        query = move;
      }
    }

    let pageSize = 10;
    let iterator = forward(async (step: number) => {
      logger.trace('%s _getList:forward', this.name);

      return await new Promise<any[]>((res, rej) => {
        let rz = this.model
          .find(query)
          .sort(sort)
          .skip(cursor.skip + step * pageSize)
          .limit(pageSize);

        if (
          this.connectors &&
          this.connectors.transaction &&
          this.connectors.transaction.session &&
          this.connectors.transaction.session.mongoose
        ) {
          rz = rz.session(this.connectors.transaction.session.mongoose);
        }

        rz.exec((err, data) => {
          if (err) {
            logger.error('%s _getList:forward:error', this.name);
            rej(err);
          } else {
            logger.trace('%s _getList:forward:done', this.name);
            res(data);
          }
        });
      });
    }, pageSize);

    for await (let source of iterator) {
      if (
        (cursor.limit && result.length < cursor.limit) ||
        (!cursor.limit || cursor.limit <= 0)
      ) {
        logger.trace('%s _getList:more', this.name);
        if (await this.readSecure(source)) {
          if (hasExtraCondition) {
            if (await checkExtraCriteria(this.toJSON(source))) {
              result.push(source);
            }
          } else {
            result.push(source);
          }
        }
      } else {
        logger.trace('%s _getList:limit', this.name);
        break;
      }
    }

    this.storeToCache(result);
    return result;
  }

  protected async _create(obj: Payload) {
    logger.trace('%s _create', this.name);
    let res = new this.model(obj);
    if (
      this.connectors &&
      this.connectors.transaction &&
      this.connectors.transaction.session &&
      this.connectors.transaction.session.mongoose
    ) {
      res.$session(this.connectors.transaction.session.mongoose);
    } else {
      res.$session(undefined);
    }
    return await res.save();
  }

  protected async _update(record, obj: Payload) {
    logger.trace('%s _update', this.name);
    for (let f in obj) {
      if (obj.hasOwnProperty(f)) {
        record.set(f, obj[f]);
      }
    }
    if (
      this.connectors &&
      this.connectors.transaction &&
      this.connectors.transaction.session &&
      this.connectors.transaction.session.mongoose
    ) {
      record.$session(this.connectors.transaction.session.mongoose);
    } else {
      record.$session(undefined);
    }
    return await record.save();
  }

  protected async _remove(record) {
    logger.trace('%s _remove', this.name);
    if (
      this.connectors &&
      this.connectors.transaction &&
      this.connectors.transaction.session &&
      this.connectors.transaction.session.mongoose
    ) {
      record.$session(this.connectors.transaction.session.mongoose);
    } else {
      record.$session(undefined);
    }
    return await record.remove();
  }

  public async sync({ force = false }: { force?: boolean }) {
    logger.trace('%s sync empty', this.name);
    return;
  }
}
