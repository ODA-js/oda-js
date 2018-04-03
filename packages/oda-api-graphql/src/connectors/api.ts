import { ACLCRUD } from '../acl/secureAny';
import { CRUD } from './../connector';

export type ACLCheck = (context, obj: {
  source?: any,
  payload?: any;
}) => object

export type SecurityContext<Connectors> = {
  [key: string]: any;
  acls: ACLCRUD<(context: SecurityContext<Connectors>, obj: {
    source?: any,
    payload?: object;
  }) => object | Promise<any>>;
  group: string;
}

export default class ConnectorsApiBase<Connectors, Payload extends object> {
  public name: string;
  protected securityContext: SecurityContext<Connectors>;
  public schema: any;
  public model: any;
  public connectors: Connectors;

  public loaders: any;
  public updaters: any;
  public loaderKeys: any;
  public storeToCache: any;

  constructor({ name, connectors, securityContext }: {
    name: string;
    connectors: Connectors;
    securityContext: SecurityContext<Connectors>
  }) {
    this.name = name;
    this.connectors = connectors;
    this.securityContext = securityContext;
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

  public secure(action: CRUD, obj: {
    source?: any,
    payload?: Payload;
  }) {
    return this.securityContext.acls[action].allow(this.securityContext.group, this.name)(this.securityContext, obj) as Payload;
  }

  protected _defaultAccess(context: ConnectorsApiBase<Connectors, Payload>, obj: {
    source?: any,
    payload?: Payload;
  }): object {
    let result = obj.source;
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

  public async readSecure(source: Payload) {
    if (this.securityContext) {
      return this.secure('read', { source })
    } else {
      return source;
    }
  }

  public async createSecure(payload: Payload) {
    if (this.securityContext) {
      if (this.secure('create', { payload })) {
        return this._create(payload);
      }
    } else {
      return this._create(payload);
    }
  }

  protected async _create(payload: Payload): Promise<any> {
    throw new Error('not implemented');
  }

  public async updateSecure(source, payload: Payload) {
    if (this.securityContext) {
      if (this.secure('update', { source, payload })) {
        return this._update(source, payload);
      }
    } else {
      return this._update(source, payload);
    }
  }

  protected async _update(source, payload: Payload): Promise<any> {
    throw new Error('not implemented');
  }

  public async removeSecure(source) {
    if (this.securityContext) {
      if (this.secure('remove', { source })) {
        return this._remove(source);
      }
    } else {
      return this._remove(source);
    }
  }

  protected async _remove(record): Promise<any> {
    throw new Error('not implemented');
  }

  public getPayload(args) { return {} as Payload; };

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
      if (this.securityContext) {
        return items.map(source => this.readSecure.call(this, source));
      } else {
        return items;
      }
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

  public async sync({ force = false }: { force?: boolean }) {
    throw new Error('not implemented');
  }
}
