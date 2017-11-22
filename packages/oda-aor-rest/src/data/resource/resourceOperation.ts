import { SortOrder } from './../../constants';

import { IResourceOperation, ResponseFunction, UpdateFunction, VariablesFunction, IResourceContainer, IResourceOperationDefinition, IResource, FilterByFunction, OrderByFunction } from "./interfaces";
import { reshape } from "oda-lodash";
import { result } from './consts';
import { queries } from './resourceContainer';

export default abstract class implements IResourceOperation {
  public get query(): any {
    return this._query;
  }
  public get resultQuery(): any {
    return this._query;
  }
  public get parseResponse(): ResponseFunction {
    return this._parseResponse;
  }
  public get update(): UpdateFunction {
    return this.update;
  }
  public get variables(): VariablesFunction {
    return this._variables;
  }
  public get resource(): IResource {
    return this.resource;
  }
  public get type(): queries {
    return this._type;
  }
  public get fetchPolicy(): string {
    return this._fetchPolicy;
  }
  public get orderBy() {
    return this._orderBy;
  }
  public get filterBy() {
    return this._filterBy;
  }
  public get refetchQueries() {
    return this._refetchQueries;
  }

  public override({
    type,
    query,
    parseResponse,
    update,
    variables,
    orderBy,
    filterBy,
    fetchPolicy = 'network-only',
    refetchQueries,
}: IResourceOperationDefinition) {
    if (type) {
      this._type = type;
    }
    if (query) {
      this._query = query;
    }
    if (parseResponse) {
      this._parseResponse = parseResponse;
    }
    if (update) {
      this._update = update;
    }
    if (variables) {
      this._variables = variables;
    }
    if (orderBy) {
      this._orderBy = orderBy;
    }
    if (filterBy) {
      this._filterBy = filterBy;
    }
    if (fetchPolicy) {
      this._fetchPolicy = fetchPolicy;
    }
    if (refetchQueries) {
      this._refetchQueries = refetchQueries;
    }
  }

  private defaultUpdate(store, response) {
    // insert into cache
  };

  private defaultOrderBy(params) {
    return params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined;
  }

  public initDefaults({
    type,
    query,
    update,
  }: IResourceOperationDefinition) {
    if (!name) {
      throw new Error('name is required param');
    }
    if (!type) {
      throw new Error('type is required param');
    }
    if (!query) {
      this._query = query;
    }
    if (!update) {
      this._update = this.defaultUpdate;
    }
  }

  protected _resource: IResource;
  protected _query: any;
  protected _resultQuery: any;
  protected _parseResponse: ResponseFunction;
  protected _update: UpdateFunction;
  protected _variables: VariablesFunction;
  protected _type: queries;
  protected _fetchPolicy: string;
  protected _orderBy: OrderByFunction;
  protected _filterBy: FilterByFunction;
  protected _refetchQueries: any;

  constructor(options: IResourceOperationDefinition, resource?: IResource) {
    this.initDefaults(options);
    this.connect(resource)
    this.override(options);
  }

  public connect(resource: IResource) {
    if (resource) {
      this._resource = resource;
    }
  }
}