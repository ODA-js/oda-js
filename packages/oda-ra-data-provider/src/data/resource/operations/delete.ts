import { reshape } from 'oda-lodash';

import ResourceOperation from '../resourceOperation';
import { IResourceOperationDefinition, IResource } from '../interfaces';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.delete(
      this.resource.resourceContainer.fragments,
      this.resource.queries,
    );
  }
  public get resultQuery(): any {
    return this.resource.queries.deleteResult(
      this.resource.resourceContainer.fragments,
      this.resource.queries,
    );
  }
  constructor(options?: {
    overrides?: IResourceOperationDefinition;
    resource?: IResource;
  }) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = response => {
        const data = reshape(this.resultQuery, response.data);
        return { data: data.item };
      };
    }
    if (!this._variables) {
      this._variables = params => ({
        input: {
          id: params.id,
        },
      });
    }
  }
}
