import { reshape } from 'oda-lodash';

import ResourceOperation from '../resourceOperation';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.getMany(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.getManyResult(this.resource.fragments, this.resource.queries);
  }
  constructor(options) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = (response) => {
        const data = reshape(this.resultQuery, response.data);
        return { data: data.items };
      }
    }
    if (!this.variables) {
      this._variables = params => ({
        filter: {
          id: { in: params.ids },
        },
      });
    }
  }
}
