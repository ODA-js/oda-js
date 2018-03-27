import * as set from 'lodash/set';
import { reshape } from 'oda-lodash';

import { SortOrder } from '../../../constants';
import ResourceOperation from '../resourceOperation';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.getList(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.getListResult(this.resource.fragments, this.resource.queries);
  }
  constructor(options) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = (response) => {
        const data = reshape(this.resultQuery, response.data);
        return {
          data: data.items.data,
          total: data.items.total,
        };
      }
    }

    if (!this._orderBy) {
      this._orderBy = (params) => params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined;
    }

    if (!this._filterBy) {
      this._filterBy = (params) => Object.keys(params.filter).reduce((acc, key) => {
        if (key === 'ids') {
          return { ...acc, id: { in: params.filter[key] } };
        }
        if (key === 'q') {
          return acc;
          // return { ...acc, id: { imatch: params.filter[key] } };
        }
        return set(acc, key.replace('-', '.'), params.filter[key]);
      }, {});
    }

    if (!this._variables) {
      this._variables = (params) => {
        return {
          skip: (params.pagination.page - 1) * params.pagination.perPage,
          limit: params.pagination.perPage,
          orderBy: this.orderBy(params),
          filter: this.filterBy(params),
        };
      };
    }
  }
}

