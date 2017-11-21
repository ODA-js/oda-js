import { reshape } from 'oda-lodash';
import { SortOrder } from './../../constants';
import { PageInfoType } from 'oda-gen-common/dist/types';

import {
  IResourceBase,
  IResourceOverride,
  ResponseFunction,
  UpdateFunction,
  VariablesFunction,
  IResourceContainer,
  IResourceOperationOverride,
  Field,
  IResourceFields,
  FieldsDefinition,
} from './interfaces';

export class ResourceBase implements IResourceBase, IResourceFields {

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
   * internal query storage
   */
  private resourceQuery: IResourceOverride;

  /**
   * internal name store
   */
  protected _name: string;

  /**
   * override existing Resource configuration
   * @param overrides override options
   */
  public override(overrides: IResourceOverride) {
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

    if (overrides.CREATE) {
      this.resourceQuery.CREATE = overrides.CREATE;
    }
    if (overrides.UPDATE) {
      this.resourceQuery.UPDATE = overrides.UPDATE;
    }
    if (overrides.DELETE) {
      this.resourceQuery.DELETE = overrides.DELETE;
    }
    if (overrides.GET_ONE) {
      this.resourceQuery.GET_ONE = overrides.GET_ONE;
    }
    if (overrides.GET_LIST) {
      this.resourceQuery.GET_LIST = overrides.GET_LIST;
    }
    if (overrides.GET_MANY) {
      this.resourceQuery.GET_MANY = overrides.GET_MANY;
    }
    if (overrides.GET_MANY_REFERENCE) {
      this.resourceQuery.GET_MANY_REFERENCE = overrides.GET_MANY_REFERENCE;
    }
  }

  /**
   * create resource
   * @param name name of the resource
   * @param overrides configuration options
   */
  constructor(name: string, overrides: IResourceOverride) {
    this._name = name;
    this.override(overrides);
  }
}
