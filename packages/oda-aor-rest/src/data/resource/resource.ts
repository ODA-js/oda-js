import { IResourceQueryDefinition } from './interfaces';
import { reshape } from 'oda-lodash';
import { PageInfoType } from 'oda-gen-common/dist/types';
import {
  Create,
  Delete,
  GetMany,
  GetList,
  GetManyReference,
  GetOne,
  Update
} from './operations';

import ResourceOperation from './resourceOperation';

import {
  IResource,
  IResourceDefinition,
  ResponseFunction,
  UpdateFunction,
  VariablesFunction,
  IResourceContainer,
  IResourceOperationDefinition,
  IField,
  FieldsDefinition,
} from './interfaces';

export default class implements IResource {

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
  public get query() {
    return this._query;
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
  private _query: IResourceQueryDefinition;

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
      if (fields.fields) {
        const existingFields = Object.keys(this._fields);
        Object.keys(fields.fields).reduce((res, cur) => {
          res[cur] = fields.fields[cur];
          return res;
        }, this._fields)
      }
    }

    if (overrides.query.CREATE) {
      this._query.CREATE = (overrides.query.CREATE instanceof ResourceOperation) ? overrides.query.CREATE.connect(this) : new Create(overrides.query.CREATE, this);
    }
    if (overrides.query.UPDATE) {
      this._query.UPDATE = (overrides.query.UPDATE instanceof ResourceOperation) ? overrides.query.UPDATE.connect(this) : new Update(overrides.query.UPDATE, this);
    }
    if (overrides.query.DELETE) {
      this._query.DELETE = (overrides.query.DELETE instanceof ResourceOperation) ? overrides.query.DELETE.connect(this) : new Delete(overrides.query.DELETE, this);
    }
    if (overrides.query.GET_ONE) {
      this._query.GET_ONE = (overrides.query.GET_ONE instanceof ResourceOperation) ? overrides.query.GET_ONE.connect(this) : new GetOne(overrides.query.GET_ONE, this);
    }
    if (overrides.query.GET_LIST) {
      this._query.GET_LIST = (overrides.query.GET_LIST instanceof ResourceOperation) ? overrides.query.GET_LIST.connect(this) : new GetList(overrides.query.GET_LIST, this);
    }
    if (overrides.query.GET_MANY) {
      this._query.GET_MANY = (overrides.query.GET_MANY instanceof ResourceOperation) ? overrides.query.GET_MANY.connect(this) : new GetMany(overrides.query.GET_MANY, this);
    }
    if (overrides.query.GET_MANY_REFERENCE) {
      this._query.GET_MANY_REFERENCE = (overrides.query.GET_MANY_REFERENCE instanceof ResourceOperation) ? overrides.query.GET_MANY_REFERENCE.connect(this) : new GetManyReference(overrides.query.GET_MANY_REFERENCE, this);
    }
    return this;
  }

  /**
   * create resource
   * @param name name of the resource
   * @param overrides configuration options
   */
  constructor(overrides?: IResourceDefinition, resourceContainer?: IResourceContainer) {
    if (overrides) {
      if (overrides.name) {
        this._name = overrides.name;
      } else {
        throw new Error('name is required param');
      }
      this.override(overrides);
    }
    if (resourceContainer) {
      this.connect(resourceContainer)
    }
  }
  public connect(resourceContainer: IResourceContainer) {
    this._resourceContainer = resourceContainer;
    return this;
  }
}
