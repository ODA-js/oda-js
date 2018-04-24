import { fromGlobalId } from 'oda-isomorfic';

import {
  ConnectorsApiBase,
  listIterator,
  SecurityContext,
  consts,
  pagination,
  detectCursorDirection,
  Filter,
  } from 'oda-api-graphql';

const { forward } = listIterator;
const { DIRECTION } = consts;
const FilterMongoose = Filter.Filter;

export default class MongooseApi<RegisterConnectors, Payload extends object> extends ConnectorsApiBase<RegisterConnectors, Payload> {

  public mongoose: any;

  constructor({ mongoose, connectors, name, securityContext }: {
    mongoose: any;
    name: string;
    connectors: RegisterConnectors;
    securityContext: SecurityContext<RegisterConnectors>
  }) {
    super({ connectors, securityContext, name });
    this.mongoose = mongoose;
  }

  protected initSchema(name, schema) {
    this.schema = schema;
    if (!this.mongoose.models[name]) {
      this.model = this.mongoose.model(name, schema);
    } else {
      this.model = this.mongoose.model(name);
    }
  }
  public async getCount(args) {
    let query = this.getFilter(args);
    return (await this.model.count(query));
  }

  public getFilter(args: { filter: any, idMap: any }) {
    if (args.filter) {
      return FilterMongoose.parse(args.filter, args.idMap);
    } else {
      return {};
    }
  };

  public toJSON(obj): Payload {
    return super.toJSON((obj && obj.toObject) ? obj.toObject() : obj);
  }

  public ensureId(obj) {
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
    let hasExtraCondition = typeof checkExtraCriteria !== 'undefined';
    let query: any = this.getFilter(args);
    let sort = detectCursorDirection(args);
    let cursor = pagination(args);

    let result = [];

    let move: any = {};

    if (cursor.after || cursor.before) {
      const detect = (name: string, value: any) =>
        ({
          [name]: (sort[name] === DIRECTION.BACKWARD) ?
            { [cursor.after ? '$lt' : '$gt']: value } :
            { [cursor.before ? '$lt' : '$gt']: value },
        });
      ;
      let sortKeys = Object.keys(sort);
      if (sortKeys.length > 1) {
        let current = await this.findOneById(cursor.after || cursor.before);
        let find = sortKeys.filter(f => f !== '_id');
        find.push('_id');
        const or = [];
        while (find.length > 0) {
          const len = find.length;
          or.push(find.reduce((prev, f, index) => {
            const curr = index == len - 1 ?
              detect(f, current[f]) :
              {
                [f]: { $eq: current[f] },
              };
            prev = {
              ...prev,
              ...curr,
            };
            return prev;
          }, {}));
          find.pop();
        }
        move = { $or: or };
      } else {
        move = {
          _id: { [sort._id === DIRECTION.FORWARD ? '$gt' : '$lt']: cursor.after || cursor.before },
        };
      }
    }

    if (Object.keys(query).length > 0) {
      if (Object.keys(move).length > 0) {
        query = {
          $and: [
            move,
            query,
          ],
        };
      }
    } else {
      if (Object.keys(move).length > 0) {
        query = move;
      }
    }

    let pageSize = 10;
    let iterator = forward(async (step: number) => {
      return await new Promise<any[]>((res, rej) => {
        this.model.find(query).sort(sort)
          .skip(cursor.skip + step * pageSize)
          .limit(pageSize)
          .exec((err, data) => {
            if (err) {
              rej(err);
            } else {
              res(data);
            }
          });
      });
    }, pageSize);

    for await (let source of iterator) {
      if ((cursor.limit && (result.length < cursor.limit)) || ((!cursor.limit) || (cursor.limit <= 0))) {
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
        break;
      }
    }

    this.storeToCache(result);

    return result;
  }

  protected async _create(obj: Payload) {
    return await (new (this.model)(obj)).save();
  }

  protected async _update(record, obj: Payload) {
    for (let f in obj) {
      if (obj.hasOwnProperty(f)) {
        record.set(f, obj[f]);
      }
    }
    return await record.save();
  }

  protected async _remove(record) {
    return await record.remove();
  }

  public async sync({ force = false }: { force?: boolean }) { }
}
