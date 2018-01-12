import * as merge from 'lodash/merge';

import { FragmentsDefintions, IResourceOperationsDefinition, IResourceQueryDefinitions } from './interfaces';
import { FieldsDefinition, IResource, IResourceContainer, IResourceDefinition } from './interfaces';
import { Create, Delete, GetList, GetMany, GetManyReference, GetOne, Update } from './operations';
import ResourceOperation from './resourceOperation';

export default class implements IResource {
  public get fragments() {
    return this._fragments;
  }
  protected _fragments: FragmentsDefintions;

  public get queries() {
    return this._queries;
  }

  protected _queries: IResourceQueryDefinitions;
  public get fields(): FieldsDefinition {
    return this._fields;
  }

  protected _fields: FieldsDefinition = {}

  /**
   * name of the Resource
   */
  public get name(): string {
    return this._name;
  }

  /**
   * list of available queries
   */
  public get operations() {
    return this._operations;
  }

  /**
   * resourceContainer
   */
  public get resourceContainer(): IResourceContainer {
    return this._resourceContainer;
  }

  /**
   * internal store for resourceContainer
   */
  private _resourceContainer: IResourceContainer;

  /**
   * internal query storage
   */
  private _operations: IResourceOperationsDefinition;

  /**
   * internal name store
   */
  protected _name: string;

  /**
   * override existing Resource configuration
   * @param overrides override options
   */
  public override(overrides: IResourceDefinition) {
    if (overrides.fields) {
      const { fields } = overrides;
      if (fields) {
        Object.keys(fields).reduce((res, cur) => {
          res[cur] = fields[cur];
          return res;
        }, this._fields)
      }
    }

    if (overrides.fragments) {
      if (this._fragments) {
        this._fragments = {
          ...this._fragments,
          ...overrides.fragments,
        }
      } else {
        this._fragments = overrides.fragments;
      }
    }

    if (overrides.queries) {
      if (this._queries) {
        this._queries = {
          ...this._queries,
          ...overrides.queries,
        }
      } else {
        this._queries = overrides.queries;
      }
    }

    if (overrides.operations) {
      if (!this._operations) {
        this._operations = {

        };
      }
      if (overrides.operations.CREATE) {
        if (!this._operations.CREATE) {
          this._operations.CREATE = (overrides.operations.CREATE instanceof ResourceOperation) ? overrides.operations.CREATE.connect(this) : new Create({ overrides: overrides.operations.CREATE, resource: this });
        } else {
          this._operations.CREATE.override(overrides.operations.CREATE);
        }
      }
      if (overrides.operations.UPDATE) {
        if (!this._operations.UPDATE) {
          this._operations.UPDATE = (overrides.operations.UPDATE instanceof ResourceOperation) ? overrides.operations.UPDATE.connect(this) : new Update({ overrides: overrides.operations.UPDATE, resource: this });
        } else {
          this._operations.UPDATE.override(overrides.operations.UPDATE);
        }
      }
      if (overrides.operations.DELETE) {
        if (!this._operations.DELETE) {
          this._operations.DELETE = (overrides.operations.DELETE instanceof ResourceOperation) ? overrides.operations.DELETE.connect(this) : new Delete({ overrides: overrides.operations.DELETE, resource: this });
        } else {
          this._operations.DELETE.override(overrides.operations.DELETE);
        }
      }
      if (overrides.operations.GET_ONE) {
        if (!this._operations.GET_ONE) {
          this._operations.GET_ONE = (overrides.operations.GET_ONE instanceof ResourceOperation) ? overrides.operations.GET_ONE.connect(this) : new GetOne({ overrides: overrides.operations.GET_ONE, resource: this });
        } else {
          this._operations.GET_ONE.override(overrides.operations.GET_ONE);
        }
      }
      if (overrides.operations.GET_LIST) {
        if (!this._operations.GET_LIST) {
          this._operations.GET_LIST = (overrides.operations.GET_LIST instanceof ResourceOperation) ? overrides.operations.GET_LIST.connect(this) : new GetList({ overrides: overrides.operations.GET_LIST, resource: this });
        } else {
          this._operations.GET_LIST.override(overrides.operations.GET_LIST);
        }
      }
      if (overrides.operations.GET_MANY) {
        if (!this._operations.GET_MANY) {
          this._operations.GET_MANY = (overrides.operations.GET_MANY instanceof ResourceOperation) ? overrides.operations.GET_MANY.connect(this) : new GetMany({ overrides: overrides.operations.GET_MANY, resource: this });
        } else {
          this._operations.GET_MANY.override(overrides.operations.GET_MANY);
        }
      }
      if (overrides.operations.GET_MANY_REFERENCE) {
        if (!this._operations.GET_MANY_REFERENCE) {
          this._operations.GET_MANY_REFERENCE = (overrides.operations.GET_MANY_REFERENCE instanceof ResourceOperation) ? overrides.operations.GET_MANY_REFERENCE.connect(this) : new GetManyReference({ overrides: overrides.operations.GET_MANY_REFERENCE, resource: this });
        } else {
          this._operations.GET_MANY_REFERENCE.override(overrides.operations.GET_MANY_REFERENCE);
        }
      }
    }
    return this;
  }

  /**
   * create resource
   * @param name name of the resource
   * @param overrides configuration options
   */
  constructor(options?: { overrides?: IResourceDefinition, resourceContainer?: IResourceContainer }) {
    if (options) {
      if (options.overrides) {
        if (options.overrides.name) {
          this._name = options.overrides.name;
        } else {
          throw new Error('name is required param');
        }

        this.override(
          merge({
            operations: {
              GET_LIST: {},
              GET_ONE: {},
              GET_MANY: {},
              GET_MANY_REFERENCE: {},
              CREATE: {},
              UPDATE: {},
              DELETE: {},
            }
          },
            options.overrides,
          )
        );
      }
      if (options.resourceContainer) {
        this.connect(options.resourceContainer)
      }
    }
  }
  public connect(resourceContainer: IResourceContainer) {
    this._resourceContainer = resourceContainer;
    return this;
  }
}
