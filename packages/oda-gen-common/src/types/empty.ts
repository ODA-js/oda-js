import deepMerge from './../lib/deepMerge';
import fillDefaults from './../lib/fillDefaults';
import * as jsonUtils from '../lib';
import * as invariant from 'invariant';
import * as warning from 'warning';
import { OrderedMap } from 'immutable';
// let padding = 0;

const hashToString = (entry) => entry ? Object.keys(entry).reduce((result, curr) => {
  if (curr) {
    if (Array.isArray(entry[curr])) {
      result.push(...entry[curr]);
    } else {
      result.push(...hashToString(entry[curr]));
    }
  }
  return result;
}, []) : [];

export class GQLModule {
  public get name(): string {
    if (!this._name && !(this.constructor && this.constructor.name)) {
      invariant(this._name, 'module has no name neither _name nor constructor.name to be initialized');
      //TODO: remove asap
      console.trace();
    }
    if (!this._name && this.constructor && this.constructor.name) {
      warning(this._name, `module ${this.constructor.name} has no name to be initialized, only constructor.name, it may drive to schema build fail in minified code`);
      //TODO: remove asap
      console.trace();
    }
    return this._name || this.constructor.name;
  }
  public get resolver(): { [key: string]: any } {
    return this._resolver || {};
  };
  public get query(): { [key: string]: any } {
    return this._query || {};
  };
  public get viewer(): { [key: string]: any } {
    return this._viewer || {};
  };
  public get mutation(): { [key: string]: any } {
    return this._mutation || {};
  };
  public get subscription(): { [key: string]: any } {
    return this._subscription || {};
  }
  public get typeDef(): string[] {
    return hashToString(this._typeDef);
  };
  public get mutationEntry(): string[] {
    return hashToString(this._mutationEntry);
  };
  public get subscriptionEntry(): string[] {
    return hashToString(this._subscriptionEntry);
  };
  public get queryEntry(): string[] {
    return hashToString(this._queryEntry);
  };
  public get viewerEntry(): string[] {
    return hashToString(this._viewerEntry);
  };
  public get hooks(): { [key: string]: any }[] {
    return this._hooks || [];
  };

  protected _name: string;
  protected _resolver: { [key: string]: any };
  protected _query: { [key: string]: any };
  protected _viewer: { [key: string]: any };
  protected _mutation: { [key: string]: any };
  protected _subscription: { [key: string]: any };
  protected _typeDef: { [key: string]: string[] };
  protected _mutationEntry: { [key: string]: string[] };
  protected _subscriptionEntry: { [key: string]: string[] };
  protected _queryEntry: { [key: string]: string[] };
  protected _viewerEntry: { [key: string]: string[] };
  protected _hooks: { [key: string]: any }[];

  protected _extend: GQLModule[];
  protected _extendees: OrderedMap<string, GQLModule>;

  // собирать объекты по порядку, а затем
  // билдить.... их...

  public applyHooks(obj) {
    let modelHooks = this.hooks;
    for (let i = 0, len = modelHooks.length; i < len; i++) {
      let hookList = Object.keys(modelHooks[i]);
      for (let j = 0, jLen = hookList.length; j < jLen; j++) {
        let key = hookList[j];
        jsonUtils.set(obj, key, modelHooks[i][key](jsonUtils.get(obj, key)));
      }
    }
    return obj;
  };

  constructor({
    name,
    resolver,
    query,
    viewer,
    typeDef,
    mutationEntry,
    subscriptionEntry,
    queryEntry,
    viewerEntry,
    mutation,
    subscription,
    hooks,
    extend,
  }: {
      name?: string,
      resolver?: { [key: string]: any };
      query?: { [key: string]: any };
      viewer?: { [key: string]: any };
      mutation?: { [key: string]: any };
      subscription?: { [key: string]: any };
      typeDef?: { [key: string]: string[] };
      mutationEntry?: { [key: string]: string[] };
      subscriptionEntry?: { [key: string]: string[] };
      queryEntry?: { [key: string]: string[] };
      viewerEntry?: { [key: string]: string[] };
      hooks?: { [key: string]: any }[];
      extend?: GQLModule[],
    }) {
    this._name = name;
    this._resolver = resolver;
    this._query = query;
    this._viewer = viewer;
    this._mutation = mutation;
    this._subscription = subscription;
    this._typeDef = typeDef;
    this._mutationEntry = mutationEntry;
    this._subscriptionEntry = subscriptionEntry;
    this._queryEntry = queryEntry;
    this._viewerEntry = viewerEntry;
    this._hooks = hooks;
    this._extend = extend;
  }

  public discover(extendees: OrderedMap<string, GQLModule>) {
    if (this._extend && this._extend.length > 0) {
      this._extend.forEach(e => {
        extendees = e.discover(extendees);
        if (!extendees.has(e.name)) {
          extendees = extendees.set(e.name, e);
        } else {
          debugger;
          let original = extendees.get(e.name);
          /// похоже что тут проблема
          e.override(original);
          extendees = extendees.set(e.name, e);
        }
      });
    }
    return extendees;
  }

  public build() {
    debugger;
    if (!this._extendees) {
      this._extendees = OrderedMap();
    } else {
      this._extendees = this._extendees.clear();
    }
    this._extendees = this.discover(this._extendees);
    this.extend(Array.from(this._extendees.values()));
  }

  private extend(obj: GQLModule | GQLModule[]) {
    if (Array.isArray(obj)) {
      for (let i = 0, len = obj.length; i < len; i++) {
        this.extend(obj[i]);
      }
    } else {
      this._resolver = deepMerge(this._resolver, obj.resolver);
      this._query = deepMerge(this._query, obj.query);
      this._viewer = deepMerge(this._viewer, obj.viewer);
      this._mutation = deepMerge(this._mutation, obj.mutation);
      this._subscription = deepMerge(this._subscription, obj.subscription);
      this._typeDef = deepMerge(this._typeDef, obj._typeDef);
      this._mutationEntry = deepMerge(this._mutationEntry, obj._mutationEntry);
      this._subscriptionEntry = deepMerge(this._subscriptionEntry, obj._subscriptionEntry);
      this._queryEntry = deepMerge(this._queryEntry, obj._queryEntry);
      this._viewerEntry = deepMerge(this._viewerEntry, obj._viewerEntry);
      this._hooks = [...this._hooks || [], ...obj.hooks || []];
    }
  }

  private override(obj: GQLModule | GQLModule[]) {
    if (Array.isArray(obj)) {
      for (let i = 0, len = obj.length; i < len; i++) {
        this.override(obj[i]);
      }
    } else {
      this._resolver = fillDefaults(obj._resolver, this.resolver);
      this._query = fillDefaults(obj._query, this.query);
      this._viewer = fillDefaults(obj._viewer, this.viewer);
      this._mutation = fillDefaults(obj._mutation, this.mutation);
      this._subscription = fillDefaults(obj._subscription, this.subscription);
      this._typeDef = fillDefaults(obj._typeDef, this._typeDef);
      this._mutationEntry = fillDefaults(obj._mutationEntry, this._mutationEntry);
      this._subscriptionEntry = fillDefaults(obj._subscriptionEntry, this._subscriptionEntry);
      this._queryEntry = fillDefaults(obj._queryEntry, this._queryEntry);
      this._viewerEntry = fillDefaults(obj._viewerEntry, this._viewerEntry);
      this._hooks = fillDefaults(obj._hooks, this.hooks);
    }
  }
}
