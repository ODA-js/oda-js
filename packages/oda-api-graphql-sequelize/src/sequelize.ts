import { fromGlobalId } from 'oda-isomorfic';

import {
  ConnectorsApiBase,
  listIterator,
  SecurityContext,
  consts,
  pagination,
  detectCursorDirection,
} from 'oda-api-graphql';

import * as Sequelize from 'sequelize';
import { FilterSequelize } from './filter';


const { forward } = listIterator;
const { DIRECTION } = consts;

export default class SequelizeApi<RegisterConnectors, Payload extends object> extends ConnectorsApiBase<RegisterConnectors, Payload>{

  public sequelize: Sequelize.Sequelize;

  constructor({ sequelize, connectors, name, securityContext }: {
    sequelize: any;
    name: string;
    connectors: RegisterConnectors;
    securityContext: SecurityContext<RegisterConnectors>
  }) {
    super({ connectors, securityContext, name });
    this.sequelize = sequelize;
  }

  protected initSchema(name, schema) {
    this.schema = schema;
    if (!this.sequelize.isDefined(name)) {
      this.model = this.schema(this.sequelize, Sequelize);
    } else {
      this.model = this.sequelize.model(name);
    }
  }

  public async getCount(args) {
    let query = this.getFilter(args);
    return (await this.model.count(query));
  }

  public getFilter(args: { filter: any, idMap: any }) {
    if (args.filter) {
      return FilterSequelize.parse(args.filter, args.idMap);
    } else {
      return {};
    }
  };

  public ensureId(obj) {
    if (obj) {
      return this.toJSON({
        ...obj,
        _id: obj.id,
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
      return await this.model.findAll({
        offset: cursor.skip + step * pageSize,
        limit: pageSize,
        where: query,
        order: Object.keys(sort).reduce((order, curr) => {
          order.push([curr === '_id' ? 'id' : curr, sort[curr] === DIRECTION.FORWARD ? 'ASC' : 'DESC'])
          return order;
        }, [])
      });
    }, pageSize);

    for await (let source of iterator) {
      if ((cursor.limit && (result.length < cursor.limit)) || ((!cursor.limit) || (cursor.limit <= 0))) {
        if (await this.readSecure(source)) {
          if (hasExtraCondition) {
            if (await checkExtraCriteria(source)) {
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
    return await this.model.create(obj);
  }

  protected async _update(record, obj: Payload) {
    return await record.update(obj);
  }

  protected async _remove(record) {
    return await record.destroy();
  }

  public async sync({ force = false }: { force?: boolean }) {
    await this.model.sync({ force });
  }
}
