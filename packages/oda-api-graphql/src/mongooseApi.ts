import pagination from './pagination';
import { fromGlobalId } from 'graphql-relay';

export default class MongooseApi<RegisterConnectors> {
  protected user;
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

  protected canView(obj) {
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

  public getFilter(args) { return args; };
  public getSort(args) { return args; };
  public getPayload(args) { return args; };

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

  constructor({ mongoose, connectors, user, owner }) {
    this.connectors = connectors;
    this.mongoose = mongoose;
    this.user = user;
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
    let sort = this.getSort(args);
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

  public async getList(args, checkExtraCriteria?) {
    let hasExtraCondition = typeof checkExtraCriteria !== 'undefined'
    let query = this.getFilter(args);
    let sort = this.getSort(args);
    let cursor = pagination(args);

    let result = [];

    if (cursor.before) {
      query = { $and: [{ _id: { $lt: cursor.before } }, query] };
    } else if (cursor.after) {
      query = { $and: [{ _id: { $gt: cursor.after } }, query] };

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
