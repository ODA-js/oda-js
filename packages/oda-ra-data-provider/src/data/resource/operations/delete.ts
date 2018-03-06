import { reshape } from 'oda-lodash';

import ResourceOperation from '../resourceOperation';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.delete(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.deleteResult(this.resource.fragments, this.resource.queries);
  }
  constructor(options) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = (response) => {
        const data = reshape(this.resultQuery, response.data);
        return { data: data.item };
      }
    }
    if (!this._variables) {
      this._variables = (params) => ({
        input: {
          id: params.id,
        },
      })
    }
  }
}
