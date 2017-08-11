import { ACLCRUD } from '../acl/secureAny';

export default class ConnectorsApiBase<Connectors, Payload> {
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
  protected acls: ACLCRUD<(object) => object>;

  constructor({ connectors, user, owner, acls, userGroup }) {
    this.connectors = connectors;
    this.user = user;
    this.userGroup = userGroup;
    this.acls = acls;
    if (!this.acls.read.defaultAccess) {
      this.acls.read.defaultAccess = this._canView;
    }
    this.setupViewer(owner);
    this.storeToCache = this.updateLoaders('All Fields');
  }

  public canView(obj: Payload) {
    return this.acls.read.allow(this.userGroup, this.constructor.name).call(this, obj) as Payload;
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

  protected async _getList(args, checkExtraCriteria?) {
    return [];
  }

  public async getList(args, checkExtraCriteria?) {
    let result = await this._getList(args, checkExtraCriteria);
    return result
      .map(r => r.toJSON())
      .map(r => this.ensureId(r));
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
      return items.map(this.canView.bind(this));
    };
  }

  public async getCount(args) {
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

  public sync({ force = false }: { force?: boolean }) {
    throw new Error('not implemented');
  }
}
