import { IResourceOperation, ResponseFunction, UpdateFunction, VariablesFunction, IResourceContainer, ResourceOperationOverride } from "./interfaces";
import { reshape } from "oda-lodash";

export class ResourceOperation implements IResourceOperation {
  public get query(): any {
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
  public get name(): string {
    return this._name;
  }
  public get type(): string {
    return this._type;
  }
  public get fetchPolicy(): string {
    return this._fetchPolicy;
  }
  public get resourceContainer(): IResourceContainer {
    return this._resourceContainer;
  }
  public get refetchQueries(): IResourceContainer {
    return this._refetchQueries;
  }
  public override({
    name,
    type,
    query,
    resourceContainer,
    parseResponse,
    update,
    variables,
    orderBy,
    filterBy,
    fetchPolicy = 'network-only',
    refetchQueries,
}: ResourceOperationOverride) {
    if (name) {
      this._name = name;
    }
    if (type) {
      this._type = type;
    }
    if (query) {
      this._query = query;
    }
    if (resourceContainer) {
      this._resourceContainer = resourceContainer;
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

  private defaultParseResponse(response) {
    const data = reshape(this._resourceContainer.queries(this._name, result[this._type]), response.data);
    return { data: data.item };
  };

  private defaultParseGetList(response) {
    const data = reshape(this._resourceContainer.queries(this._name, result[this._type]), response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  };

  private defaultParseGetManyReferense(response, params) {
    const data = reshape(this._resourceContainer.queries(this._name, result[this._type])[params.target], response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  };

  private defaultUpdate(store, response) {
    // insert into cache
  };

  private defaultOrderBy(params) {
    return params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined;
  }

  public initDefaults({
    name,
    type,
    query,
    resourceContainer,
    parseResponse,
    update,
    variables,
    orderBy,
    filterBy,
    fetchPolicy = 'network-only',
    refetchQueries,
  }: ResourceOperationOverride) {
    if (!name) {
      throw new Error('name is required param');
    }
    if (!type) {
      throw new Error('type is required param');
    }
    if (!query) {
      this._query = resourceContainer.queries(name, type);
    }
    if (!update) {
      this._update = this.defaultUpdate;
    }
  }

  protected _query: any;
  protected _parseResponse: ResponseFunction;
  protected _update: UpdateFunction;
  protected _variables: VariablesFunction;
  protected _name: string;
  protected _type: string;
  protected _fetchPolicy: string;
  protected _orderBy: (field) => string | undefined;
  protected _filterBy: (field) => object | undefined;
  protected _resourceContainer: ResourceContainer;
  protected _refetchQueries: any;

  constructor(options: ResourceOperationOverride) {
    this.override(options);
    this.initDefaults(options);
  }
}