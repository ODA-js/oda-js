import { ACLCRUD } from '../acl/secureAny';

export type ACLCheck = (context, obj: {
  source?: any,
  payload?: any;
}) => object

export default class ConnectorsApiBase<Connectors, Payload extends object> {
  protected user;
  protected userGroup;
  protected _viewer: {
    id?: string;
    owner?: string;
    ids: object;
  };
  public schema: any;
  public model: any;
  public connectors: Connectors;

  public loaders: any;
  public updaters: any;
  public loaderKeys: any;
  public storeToCache: any;
  protected acls: ACLCRUD<(context: ConnectorsApiBase<Connectors, Payload>, obj: {
    source?: any,
    payload?: Payload;
  }) => object>;

  constructor({ connectors, user, owner, acls, userGroup }) {
    this.connectors = connectors;
    this.user = user;
    this.userGroup = userGroup;
    this.acls = acls;
    if (!this.acls.read.defaultAccess) {
      this.acls.read.defaultAccess = this._defaultAccess;
    }
    if (!this.acls.create.defaultAccess) {
      this.acls.create.defaultAccess = this._defaultCreate;
    }
    if (!this.acls.update.defaultAccess) {
      this.acls.update.defaultAccess = this._defaultAccess;
    }
    if (!this.acls.remove.defaultAccess) {
      this.acls.remove.defaultAccess = this._defaultAccess;
    }
    this.setupViewer(owner);
    this.storeToCache = this.updateLoaders('All Fields');
  }

  public toJSON(obj): Payload {
    return Object.keys(obj).reduce((ret, item) => {
      if (obj[item] !== null && obj[item].toJSON) {
        ret[item] = obj[item].toJSON();
      } else {
        ret[item] = obj[item];
      }
      return ret;
    }, {}) as Payload;
  }

  public secure(action: 'create' | 'read' | 'update' | 'remove', obj: {
    source?: any,
    payload?: Payload;
  }) {
    return this.acls[action].allow(this.userGroup, this.constructor.name)(this, obj) as Payload;
  }

  protected _defaultAccess(context: ConnectorsApiBase<Connectors, Payload>, obj: {
    source?: any,
    payload?: Payload;
  }): object {
    let result = obj.source;
    if (context.user && !context.user.isSystem) {
      if (typeof result === 'object' && result !== null && result !== undefined) {
        if (result.owner) {
          result = context._viewer && context._viewer.ids.hasOwnProperty(result.owner.toString()) ? result : null;
        }
      }
    }
    return result;
  };

  protected _defaultCreate(context: ConnectorsApiBase<Connectors, Payload>, obj: {
    source?: any,
    payload?: Payload;
  }): object {
    let result = obj.payload;
    return result;
  };

  protected async _getList(args, checkExtraCriteria?) {
    return [];
  }

  public async getList(args, checkExtraCriteria?) {
    let result = await this._getList(args, checkExtraCriteria);
    return result
      .map(r => (r && r.toJSON) ? r.toJSON() : r)
      .map(r => this.ensureId(r));
  }

  public async createSecure(payload: Payload) {
    if (this.secure('create', { payload })) {
      return this._create(payload);
    }
  }

  protected async _create(payload: Payload) {
    throw new Error('not implemented');
  }

  public async updateSecure(source, payload: Payload) {
    if (this.secure('update', { source, payload })) {
      return this._update(source, payload);
    }
  }

  protected async _update(source, payload: Payload) {
    throw new Error('not implemented');
  }

  public async removeSecure(source) {
    if (this.secure('remove', { source })) {
      return this._remove(source);
    }
  }

  protected async _remove(record) {
    throw new Error('not implemented');
  }

  public getPayload(args) { return {} as Payload; };
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

  protected initSchema(name, schema) {
    throw new Error('not implemented');
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
      return items.map(source => this.secure.call(this, 'read', { source }));
    };
  }

  public async getCount(args): Promise<Number> {
    throw new Error('not implemented');
  }

  public ensureId(obj: Payload): Payload {
    throw new Error('not implemented');
  }

  public async findOneById(id): Promise<Payload> {
    throw new Error('not implemented');
  }

  protected logUser() {
    throw new Error('not implemented');
  }

  protected initOwner() {
    throw new Error('not implemented');
  }

  public async sync({ force = false }: { force?: boolean }) {
    throw new Error('not implemented');
  }
}
