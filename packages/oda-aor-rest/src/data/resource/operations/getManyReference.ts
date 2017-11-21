import { ResourceOperation } from "../resourceOperation";
import { IResourceOperationOverride } from "../interfaces";

export default class extends ResourceOperation {
  constructor(options) {
    super(options);
    this.initDefaults(options);
  }
  initDefaults(options: IResourceOperationOverride) {
    super.initDefaults(options);
    const {
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
    } = options;
    if (!parseResponse) {
      if (type === queries.GET_MANY_REFERENCE) {
        this._parseResponse = this.defaultParseGetManyReferense;
      } else if (type === queries.GET_LIST) {
        this._parseResponse = this.defaultParseGetList;
      } else {
        this._parseResponse = this.defaultParseResponse;
      }
    }
    if (!variables) {
      if (type === queries.GET_ONE) {
        this._variables = params => ({
          id: params.id,
        });
      } else if (type === queries.GET_LIST) {
      } else if (type === queries.CREATE) {
      } else if (type === queries.UPDATE) {
      } else if (type === queries.DELETE) {
        this._variables = params => ({
          input: {
            id: params.id,
          },
        })
      } else if (type === queries.GET_MANY_REFERENCE) {
      } else if (type === queries.GET_MANY) {
        this._variables = params => ({
          filter: {
            id: { in: params.ids },
          },
        });
      } else {
        throw new Error('variables is required param');
      }
    }
  }
}
