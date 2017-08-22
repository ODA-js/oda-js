import { FilterSequelize } from '../filter';

import pagination from '../pagination';
import cursorDirection from '../direction';
import { DIRECTION } from '../consts';

import { fromGlobalId } from 'graphql-relay';
import * as Sequelize from 'sequelize';

import ConnectorsApiBase from './api';

import { forward } from './listIterator';

export default class SequelizeApi<RegisterConnectors, Payload> extends ConnectorsApiBase<RegisterConnectors, Payload>{

  public sequelize: Sequelize.Sequelize;

  constructor({ sequelize, connectors, user, owner, acls, userGroup }) {
    super({ connectors, user, owner, acls, userGroup });
    this.sequelize = sequelize;
  }

  protected initSchema(name, schema) {
    this.schema = schema;
    if (!this.sequelize.isDefined(name)) {
      this.model = this.schema(this.sequelize, Sequelize);
    } else {
      this.model = this.sequelize.model(name);
    }
    /// TODO: переделать под sequilize
    // init once
    if (this.user) {
      this.model.hook('beforeSave', this.logUser());
    }
    /// TODO: переделать под sequilize
    if (this._viewer) {
      this.model.hook('beforeSave', this.initOwner());
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
      return {
        ...obj,
        _id: obj.id,
      } as Payload;
    } else {
      return obj as Payload;
    }
  }

  protected async _getList(args, checkExtraCriteria?) {
    let hasExtraCondition = typeof checkExtraCriteria !== 'undefined';
    let query: any = this.getFilter(args);
    let sort = cursorDirection(args);
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
        let find = sortKeys.filter(f => f !== '_id').map(f => detect(f, current[f]));
        find.push({ _id: { $gt: cursor.after || cursor.before } });
        const or = [];
        while (find.length > 0) {
          or.push(find.reduce((prev, curr) => {
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

    for await (let item of iterator) {
      if ((cursor.limit && (result.length < cursor.limit)) || ((!cursor.limit) || (cursor.limit <= 0))) {
        if (this.canView(item)) {
          if (hasExtraCondition) {
            if (await checkExtraCriteria(item)) {
              result.push(item);
            }
          } else {
            result.push(item);
          }
        }
      } else {
        break;
      }
    }

    this.storeToCache(result);

    return result;
  }
  /// TODO: Переделать под sequelize
  protected logUser() {
    let _user = () => this.user;
    return function (object, options) {
      debugger;
      let user = _user();
      if (this.isNewRecord) {
        this.set('createdAt', new Date());
        this.set('createdBy', fromGlobalId(user.id).id);
      } else {
        this.set('updatedAt', new Date());
        this.set('updatedBy', fromGlobalId(user.id).id);
      }
    };
  }

  protected initOwner() {
    let _owner = () => this._viewer;
    return function (next) {
      if (this.isNewRecord && !this.get('owner')) {
        let owner = _owner();
        if (owner.owner) {
          this.set('owner', owner.owner);
        } else {
          this.set('owner', owner.id);
        }
      }
      next();
    };
  }

  public async sync({ force = false }: { force?: boolean }) {
    await this.model.sync({ force });
  }
}
