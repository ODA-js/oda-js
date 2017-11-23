import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResourceOperationDefinition, IResource } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';
import { SortOrder } from "../../../constants";
import set from 'lodash/set';

export default class extends ResourceOperation {
  _parseResponse = (response) => {
    // debugger
    const data = reshape(this._resultQuery, response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  }

  _orderBy = (params) => params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined

  _filterBy = (params) => Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id: { in: params.filter[key] } };
    }
    return set(acc, key.replace('-', '.'), params.filter[key]);
  }, {})

  _variables = (params) => {
    return {
      skip: (params.pagination.page - 1) * params.pagination.perPage,
      limit: params.pagination.perPage,
      orderBy: this.orderBy(params),
      filter: this.filterBy(params),
    };
  }
}
