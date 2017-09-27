import { Filter } from '../filter';
import pagination from '../pagination';
import cursorDirection from '../direction';
import { DIRECTION } from '../consts';

import { fromGlobalId } from 'graphql-relay';

import ConnectorsApiBase from './api';

import { forward } from './listIterator';

export default class MongooseApi<RegisterConnectors, Payload> extends ConnectorsApiBase<RegisterConnectors, Payload> {

  public mongoose: any;

  constructor({ mongoose, connectors, user, owner, acls, userGroup }) {
    super({ connectors, user, owner, acls, userGroup });
    this.mongoose = mongoose;
  }

  protected initSchema(name, schema) {
    this.schema = schema;
    if (!this.mongoose.models[name]) {
      // init once
      if (this.user) {
        this.schema.pre('save', this.logUser());
      }
      if (this._viewer) {
        this.schema.pre('save', this.initOwner());
      }
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
      return Filter.parse(args.filter, args.idMap);
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
    let sort = cursorDirection(args);
    let cursor = pagination(args);

    let result = [];

    let move: any = {};

    if (cursor.after || cursor.before) {
      const detect = (name: string, value: any) =>
        ({
          [name]: (sort[name] === DIRECTION.BACKWARD) ?
            { [cursor.after ? '$lte' : '$gte']: value } :
            { [cursor.before ? '$lte' : '$gte']: value },
        });
      ;
      let sortKeys = Object.keys(sort);
      if (sortKeys.length > 1) {
        let current = await this.findOneById(cursor.after || cursor.before);
        let find = sortKeys.filter(f => f !== '_id').map(f => detect(f, current[f]));
        find.push({ _id: { $gt: cursor.after || cursor.before } });
        move = find.reduce((prev, curr) => {
          prev = {
            ...prev,
            ...curr,
          };
          return prev;
        }, {});
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

    for await (let item of iterator) {
      if ((cursor.limit && (result.length < cursor.limit)) || ((!cursor.limit) || (cursor.limit <= 0))) {
        if (this.canView(item)) {
          if (hasExtraCondition) {
            if (await checkExtraCriteria(this.toJSON(item))) {
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

  protected logUser() {
    let _user = () => this.user;
    return function (next) {
      let user = _user();
      if (this.isNew) {
        this.set('createdAt', new Date());
        this.set('createdBy', fromGlobalId(user.id).id);
      } else {
        this.set('updatedAt', new Date());
        this.set('updatedBy', fromGlobalId(user.id).id);
      }
      next();
    };
  }

  protected initOwner() {
    let _owner = () => this._viewer;
    return function (next) {
      if (this.isNew && !this.get('owner')) {
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

  public async sync({ force = false }: { force?: boolean }) { }
}
