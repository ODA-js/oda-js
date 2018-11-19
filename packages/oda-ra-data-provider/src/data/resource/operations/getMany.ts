import { reshape } from 'oda-lodash';

import ResourceOperation from '../resourceOperation';
import { IResourceOperationDefinition, IResource } from '../interfaces';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.getMany(
      this.resource.resourceContainer.fragments,
      this.resource.queries,
    );
  }
  public get resultQuery(): any {
    return this.resource.queries.getManyResult(
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
        return { data: data.items };
      };
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
