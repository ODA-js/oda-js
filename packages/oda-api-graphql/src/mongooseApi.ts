import pagination from './pagination';
import cursorDirection from './direction';
import { Filter } from './filter';
import { DIRECTION } from './consts';

import { fromGlobalId } from 'graphql-relay';
import { ACLCRUD } from './acl/secureAny';

export default class MongooseApi<RegisterConnectors> {
  protected user;
  protected userGroup;
  protected _viewer: {
    id?: string;
    owner?: string;
    ids: object;
  };
  public schema: any;
  public model: any;
  public connectors: RegisterConnectors;
  public mongoose: any;
  public loaders: any;
  public updaters: any;
  public loaderKeys: any;
  public storeToCache: any;
  protected acls: ACLCRUD<(object) => object>;

  protected canView(obj) {
    return this.acls.read.allow(this.userGroup, this.constructor.name).call(this, obj);
  }

  protected _canView(obj) {
    let result = obj;
    if (this.user && !this.user.isSystem) {
      if (typeof obj === 'object' && obj !== null && obj !== undefined) {
        if (obj.owner) {
          result = this._viewer.ids.hasOwnProperty(obj.owner.toString()) ? obj : null;
        }
      }
    }
    return result;
  };

  // protected canUpdate(obj) {
  //   if (this.user.isSystem) {
  //     return true;
  //   } else if (obj.owner) {
  //     return this.owner === obj.owner;
  //   } else {
  //     return true;
  //   }
  // };

  // protected canDelete(obj) {
  //   if (this.user.isSystem) {
  //     return true;
  //   } else if (obj.owner) {
  //     return this.owner === obj.owner;
  //   } else {
  //     return true;
  //   }
  // };

  // protected canCreate(obj) {
  //   if (this.user.isSystem) {
  //     return true;
  //   } else if (obj.owner) {
  //     return this.owner === obj.owner;
  //   } else {
  //     return true;
  //   }
  // };

  public getFilter(args) {
    if (args.filter) {
      return Filter.parse(args.filter)
    } else {
      return {};
    }
  };
  public getPayload(args) { return {}; };

  public setupViewer(viewer?: {
    id?: string,
    owner?: string,
    ownerIds?: object,
  }) {
    if (viewer) {
      if (!this._viewer) {
        this._viewer = {
          ids: {},
        };
      }

      if (viewer.id) {
        this._viewer.id = viewer.id;
        this._viewer.ids = {
          ...this._viewer.ids,
          [viewer.id]: 1,
        };
      }

      if (viewer.owner) {
        this._viewer.owner = viewer.owner;
        this._viewer.ids = {
          ...this._viewer.ids,
          [viewer.owner]: 1,
        };
      }

      if (viewer.ownerIds) {
        this._viewer.ids = {
          ...this._viewer.ids,
          ...viewer.ownerIds,
        };
      }
    }
  }

  constructor({ mongoose, connectors, user, owner, acls, userGroup }) {
    this.connectors = connectors;
    this.mongoose = mongoose;
    this.user = user;
    this.userGroup = userGroup;
    this.acls = acls;
    if (!this.acls.read.defaultAccess) {
      this.acls.read.defaultAccess = this._canView;
    }
    this.setupViewer(owner);
    this.storeToCache = this.updateLoaders('All Fields');
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

  public updateLoaders(name: string) {
    return (items) => {
      for (let curr of Object.keys(this.loaders)) {
        if (curr === name) { continue; }
        let key = this.loaderKeys[curr];
        for (let item of items) {
          if (item) {
            let cacheKey = typeof key === 'function' ? key(item) : item[key];
            this.loaders[curr].clear(cacheKey).prime(cacheKey, item);
          }
        }
      }
      return items.map(this.canView.bind(this));
    };
  }

  public async getCount(args) {
    let query = this.getFilter(args);
    return (await this.model.count(query));
  }

  public async getFirst(args) {
    let query = this.getFilter(args);
    let sort = cursorDirection(args);
    return this.ensureId(await this.model
      .findOne(query, { _id: 1 })
      .sort(sort)
      .lean(true)
      .exec());
  }

  public ensureId = (obj) => {
    if (obj) {
      return {
        ...obj,
        id: obj._id,
      };
    } else {
      return obj;
    }
  }

  public async findOneById(id?: string) {
    throw new Error('must be overriden');
  }

  public async getList(args, checkExtraCriteria?) {
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
            { [cursor.before ? '$lt' : '$gt']: value }
        });
      ;
      let sortKeys = Object.keys(sort);
      if (sortKeys.length > 1) {
        let current = await this.findOneById(cursor.after || cursor.before);
        let find = sortKeys.filter(f => f != '_id').map(f => detect(f, current[f]));
        find.push({ _id: { $gt: cursor.after || cursor.before } });
        const or = [];
        while (find.length > 0) {
          or.push(find.reduce((prev, curr) => {
            prev = {
              ...prev,
              ...curr,
            }
            return prev;
          }, {}));
          find.pop();
        }
        move = { $or: or };
      } else {
        detect('_id', cursor.after || cursor.before);
      }
    }

    if (Object.keys(query).length > 0) {
      if (Object.keys(move).length > 0) {
        query = {
          $and: [
            move,
            query
          ]
        }
      }
    } else {
      if (Object.keys(move).length > 0) {
        query = move;
      }
    }

    let answer = this.model.find(query).sort(sort).skip(cursor.skip)
      .cursor();

    while (result.length < cursor.limit) {
      let item = await answer.next();
      if (item == null) { break; }
      if (this.canView(item)) {
        if (hasExtraCondition) {
          if (await checkExtraCriteria(item)) {
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
    }

    this.storeToCache(result);

    return result
      .map(r => r.toJSON())
      .map(this.ensureId);
  }

  private logUser() {
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

  private initOwner() {
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
}
