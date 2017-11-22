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
    return this.resourceQuery;
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
  private resourceQuery: IResourceQueryDefinition;

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
      this.resourceQuery.CREATE = new Create(overrides.query.CREATE);
    }
    if (overrides.query.UPDATE) {
      this.resourceQuery.UPDATE = overrides.query.UPDATE;
    }
    if (overrides.query.DELETE) {
      this.resourceQuery.DELETE = overrides.query.DELETE;
    }
    if (overrides.query.GET_ONE) {
      this.resourceQuery.GET_ONE = overrides.query.GET_ONE;
    }
    if (overrides.query.GET_LIST) {
      this.resourceQuery.GET_LIST = overrides.query.GET_LIST;
    }
    if (overrides.query.GET_MANY) {
      this.resourceQuery.GET_MANY = overrides.query.GET_MANY;
    }
    if (overrides.query.GET_MANY_REFERENCE) {
      this.resourceQuery.GET_MANY_REFERENCE = overrides.query.GET_MANY_REFERENCE;
    }
  }

  /**
   * create resource
   * @param name name of the resource
   * @param overrides configuration options
   */
  constructor(overrides: IResourceDefinition, resourceContainer: IResourceContainer) {
    if (overrides.name) {
      this._name = overrides.name;
    } else {
      throw new Error('name is required param');
    }
    if (resourceContainer) {
      this.connect(resourceContainer)
    }
    this.override(overrides);
  }
  public connect(resourceContainer: IResourceContainer) {
    this._resourceContainer = resourceContainer;
  }
}
