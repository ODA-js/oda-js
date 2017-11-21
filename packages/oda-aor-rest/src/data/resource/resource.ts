import { IResourceQueryDefinition } from './interfaces';
import { reshape } from 'oda-lodash';
import { PageInfoType } from 'oda-gen-common/dist/types';

import {
  IResource,
  IResourceDefinition,
  ResponseFunction,
  UpdateFunction,
  VariablesFunction,
  IResourceContainer,
  IResourceOperationOverride,
  Field,
  FieldsDefinition,
} from './interfaces';
import { ResourceContainer } from './resourceContainer';

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

    if (overrides.queries.CREATE) {
      this.resourceQuery.CREATE = overrides.queries.CREATE;
    }
    if (overrides.queries.UPDATE) {
      this.resourceQuery.UPDATE = overrides.queries.UPDATE;
    }
    if (overrides.queries.DELETE) {
      this.resourceQuery.DELETE = overrides.queries.DELETE;
    }
    if (overrides.queries.GET_ONE) {
      this.resourceQuery.GET_ONE = overrides.queries.GET_ONE;
    }
    if (overrides.queries.GET_LIST) {
      this.resourceQuery.GET_LIST = overrides.queries.GET_LIST;
    }
    if (overrides.queries.GET_MANY) {
      this.resourceQuery.GET_MANY = overrides.queries.GET_MANY;
    }
    if (overrides.queries.GET_MANY_REFERENCE) {
      this.resourceQuery.GET_MANY_REFERENCE = overrides.queries.GET_MANY_REFERENCE;
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
    if (overrides.name) {
      this._resourceContainer = resourceContainer;
    } else {
      throw new Error('resourceContainer is required param');
    }
    this.override(overrides);
  }
}
