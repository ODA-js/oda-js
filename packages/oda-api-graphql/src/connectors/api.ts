import { ACLCRUD } from '../acl/secureAny';
import { CRUD } from './../connector';
import getLogger from 'oda-logger';
let logger = getLogger('oda-api-graphql:api:base');

export type ACLCheck = (
  context,
  obj: {
    source?: any;
    payload?: any;
  },
) => object;

export type SecurityContext<Connectors> = {
  [key: string]: any;
  acls: ACLCRUD<
    (
      context: SecurityContext<Connectors>,
      obj: {
        source?: any;
        payload?: object;
      },
    ) => object | Promise<any>
  >;
  group: string;
};

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

  constructor({
    name,
    connectors,
    securityContext,
  }: {
    name: string;
    connectors: Connectors;
    securityContext: SecurityContext<Connectors>;
  }) {
    this.name = name;
    this.connectors = connectors;
    this.securityContext = securityContext;
    this.storeToCache = this.updateLoaders('All Fields');
  }

  public toJSON(obj): Payload {
    const result = Object.keys(obj).reduce((ret, item) => {
      if (obj[item] !== null && obj[item].toJSON) {
        ret[item] = obj[item].toJSON();
      } else {
        ret[item] = obj[item];
      }
      return ret;
    }, {}) as Payload;
    logger.info('%s toJSON:result ret %o', this.name, result);
    return result;
  }

  public secure(
    action: CRUD,
    obj: {
      source?: any;
      payload?: Payload;
    },
  ) {
    const result = this.securityContext.acls[action].allow(
      this.securityContext.group,
      this.name,
    )(this.securityContext, obj) as Payload;
    logger.info('%s secure %o', this.name, result);
    return result;
  }

  protected _defaultAccess(
    context: ConnectorsApiBase<Connectors, Payload>,
    obj: {
      source?: any;
      payload?: Payload;
    },
  ): object {
    let result = obj.source;
    logger.info('%s _defaultAccess %o', this.name, result);
    return result;
  }

  protected _defaultCreate(
    context: ConnectorsApiBase<Connectors, Payload>,
    obj: {
      source?: any;
      payload?: Payload;
    },
  ): object {
    let result = obj.payload;
    logger.info('%s _defaultCreate %o', this.name, result);
    return result;
  }

  protected async _getList(args, checkExtraCriteria?) {
    logger.trace('%s default _getList', this.name);
    return [];
  }

  public async getList(args, checkExtraCriteria?) {
    logger.info('%s getList args %o', this.name, args);
    let result = await this._getList(args, checkExtraCriteria);
    result = result
      .map(r => (r && r.toJSON ? r.toJSON() : r))
      .map(r => this.ensureId(r));
    logger.info('%s getList result %o', this.name, result);
    return result;
  }

  public async readSecure(source?: Payload) {
    if (source) {
      logger.trace('%s readSecure %o', this.name, source);
      let result: Payload;
      if (this.securityContext) {
        result = this.secure('read', { source });
        if (!result) {
          logger.error('%s readSecure:prohibited', this.name);
        } else {
          logger.trace('%s readSecure:allowed %o', this.name, result);
        }
      } else {
        result = source;
        logger.trace('%s readSecure:allowed as is', this.name);
      }
      return result;
    } else {
      logger.error('%s readSecure empty', this.name);
      return source;
    }
  }

  public async createSecure(payload?: Payload) {
    if (payload) {
      let result;
      logger.trace('%s createSecure % o', this.name, payload);
      if (this.securityContext) {
        if (this.secure('create', { payload })) {
          result = await this._create(payload);
        } else {
          logger.error('%s createSecure:prohibit', this.name);
          throw new Error(`can't create item due to security issue`);
        }
      } else {
        result = await this._create(payload);
      }
      logger.trace('%s createSecure %o', this.name, result);
      return result;
    } else {
      logger.error('%s createSecure empty', this.name);
      return payload;
    }
  }

  protected async _create(payload: Payload): Promise<any> {
    logger.error('%s _create not implemented', this.name);
    throw new Error('not implemented');
  }

  public async updateSecure(source?, payload?: Payload) {
    if (source && payload) {
      let result;
      logger.trace('%s updateSecure:payload  %o', this.name, payload);
      logger.trace('%s updateSecure:source %o', this.name, source);
      if (this.securityContext) {
        if (this.secure('update', { source, payload })) {
          result = await this._update(source, payload);
        } else {
          logger.error('%s updateSecure:prohibit', this.name);
          throw new Error(`can't update item due to security issue`);
        }
      } else {
        result = await this._update(source, payload);
      }
      logger.trace('%s updateSecure %o', this.name, result);
      return result;
    } else {
      logger.error('%s updateSecure empty', this.name);
      return source;
    }
  }

  protected async _update(source, payload: Payload): Promise<any> {
    logger.error('%s _update not implemented', this.name);
    throw new Error('not implemented');
  }

  public async removeSecure(source?) {
    if (source) {
      let result;
      if (this.securityContext) {
        if (this.secure('remove', { source })) {
          result = await this._remove(source);
        } else {
          logger.error('%s removeSecure:prohibit %o', this.name, source);
          throw new Error(`can't remove item due to security issue`);
        }
      } else {
        result = await this._remove(source);
      }
      logger.trace('%s removeSecure:done %o', this.name, source);
      return result;
    } else {
      logger.error('%s removeSecure empty', this.name);
      return source;
    }
  }

  protected async _remove(record): Promise<any> {
    logger.error('%s _remove', this.name);
    throw new Error('not implemented');
  }

  public getPayload(args) {
    logger.error('default getPayload %o', args);
    return {} as Payload;
  }

  protected initSchema(name, schema) {
    logger.error('default name %j', name);
    logger.error('default initSchema %j', schema);
    throw new Error('not implemented');
  }

  public updateLoaders(name: string) {
    return items => {
      logger.trace('%s updateLoaders %s', this.name, name);
      for (let curr of Object.keys(this.loaders)) {
        if (curr === name) {
          continue;
        }
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
    logger.error('%s getCount not implemented', this.name);
    throw new Error('not implemented');
  }

  public ensureId(obj: Payload): Payload {
    logger.error('%s ensureId not implemented', this.name);
    throw new Error('not implemented');
  }

  public async findOneById(id): Promise<Payload> {
    logger.error('%s findOneById not implemented', this.name);
    throw new Error('not implemented');
  }

  public async sync({ force = false }: { force?: boolean }) {
    logger.error('%s sync not implemented', this.name);
    throw new Error('not implemented');
  }
}
