import { ResourceOperation } from "../resourceOperation";
import { IResourceOperation, refType } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';
import { SortOrder } from "../../../constants";
import set from 'lodash/set';

///!!! ПОСМЛОТРЕТЬ ЗДЕСЬ КОД!!!
const useOpposite = {
};


export default class extends ResourceOperation {
  constructor(options) {
    super(options);
    this.initDefaults(options);
  }

  initDefaults(options: IResourceOperation) {
    super.initDefaults(options);
  }

  public get query() {
    return params => this._query[params.target]
  }

  public get resultQuery() {
    return params => this._resultQuery[params.target]
  }

  _parseResponse = (response, params) => {
    const data = reshape(this._resultQuery[params.target], response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  }

  _orderBy = (params) => params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined

  _filterBy = (params) => !useOpposite[params.target] ? {
    [params.target]: { eq: params.id }
  } : undefined;

  _variables = (params) => {
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
