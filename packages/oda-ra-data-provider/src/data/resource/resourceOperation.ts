import {
  FilterByFunction,
  IResource,
  IResourceOperation,
  IResourceOperationDefinition,
  OrderByFunction,
  ResponseFunction,
  ShouldFakeExecuteFunction,
  UpdateFunction,
  VariablesFunction,
  FetchPolicyFunction,
} from './interfaces';
import { queries } from './consts';
import { SortOrder } from '../../constants';

export default abstract class implements IResourceOperation {
  public get query(): any {
    throw new Error('unimplemented');
  }
  public get resultQuery(): any {
    throw new Error('unimplemented');
  }
  public get parseResponse(): ResponseFunction {
    return this._parseResponse;
  }
  public get update(): UpdateFunction {
    return this._update;
  }
  public get variables(): VariablesFunction {
    return this._variables;
  }
  public get resource(): IResource {
    return this._resource;
  }
  public get type(): queries {
    return this._type;
  }
  public get fetchPolicy(): string | FetchPolicyFunction {
    return this._fetchPolicy;
  }
  public get orderBy() {
    return this._orderBy;
  }
  public get filterBy() {
    return this._filterBy;
  }
  public get reFetchQueries() {
    return this._reFetchQueries;
  }

  public get shouldFakeExecute() {
    return this._shouldFakeExecute;
  }

  protected _shouldFakeExecute!: ShouldFakeExecuteFunction;
  protected _resource!: IResource;
  protected _parseResponse!: ResponseFunction;
  protected _update!: UpdateFunction;
  protected _variables!: VariablesFunction;
  protected _type!: queries;
  protected _fetchPolicy!: string | FetchPolicyFunction;
  protected _orderBy!: OrderByFunction;
  protected _filterBy!: FilterByFunction;
  protected _reFetchQueries: any;

  public override({
    parseResponse,
    update,
    variables,
    orderBy,
    filterBy,
    fetchPolicy = 'network-only',
    reFetchQueries,
    shouldFakeExecute,
  }: IResourceOperationDefinition) {
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
    if (reFetchQueries) {
      this._reFetchQueries = reFetchQueries;
    }
    if (shouldFakeExecute) {
      this._shouldFakeExecute = shouldFakeExecute;
    }
    return this;
  }

  public initDefaults({
    shouldFakeExecute,
    update,
  }: IResourceOperationDefinition) {
    if (!update) {
      this._update = this.defaultUpdate;
    }
    if (!shouldFakeExecute) {
      this._shouldFakeExecute = false;
    }
  }

  constructor(options?: {
    overrides?: IResourceOperationDefinition;
    resource?: IResource;
  }) {
    if (options) {
      if (options.overrides) {
        this.initDefaults(options.overrides);
        this.override(options.overrides);
      }
      if (options.resource) {
        this.connect(options.resource);
      }
    }
  }

  public connect(resource: IResource) {
    if (resource) {
      this._resource = resource;
    }
    return this;
  }

  private defaultUpdate(store, response) {
    // insert into cache
  }

  private defaultOrderBy(params: { sort: { field: string; order: string } }) {
    return params.sort.field !== 'id'
      ? `${params.sort.field}${SortOrder[params.sort.order]}`
      : undefined;
  }
}
