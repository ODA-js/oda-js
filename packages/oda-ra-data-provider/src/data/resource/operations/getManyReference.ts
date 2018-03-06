import { reshape } from 'oda-lodash';

import { SortOrder } from '../../../constants';
import { refType } from '../interfaces';
import ResourceOperation from '../resourceOperation';

export default class extends ResourceOperation {
  public get query() {
    return params => this.resource.queries.getManyReference(this.resource.fragments, this.resource.queries)[params.target];
  }

  public get resultQuery() {
    return params => this.resource.queries.getManyReferenceResult(this.resource.fragments, this.resource.queries)[params.target]
  }

  constructor(options) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = (response, params) => {
        const data = reshape(this.resultQuery(params), response.data);
        return {
          data: data.items.data,
          total: data.items.total,
        };
      }
    }

    if (!this._orderBy) {
      this._orderBy = (params) => params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined
    }

    if (!this._filterBy) {
      this._filterBy = (params) => {
        const useOpposite = this._resource.fields[params.target].ref.type === refType.BelongsToMany;
        return !useOpposite ? {
          [params.target]: { eq: params.id }
        } : undefined;
      }
    }

    if (!this._variables) {
      this._variables = (params) => {
        return {
          id: params.id,
          target: params.target,
          skip: (params.pagination.page - 1) * params.pagination.perPage,
          limit: params.pagination.perPage,
          orderBy: this.orderBy(params),
          filter: this.filterBy(params),
        };
      }
    }
  }
}
