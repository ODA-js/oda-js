import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResource, IResourceOperationDefinition } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.getMany(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.getManyResult(this.resource.fragments, this.resource.queries);
  }
  _parseResponse = (response) => {
    const data = reshape(this.resultQuery, response.data);
    return { data: data.items };
  }
  _variables = params => ({
    filter: {
      id: { in: params.ids },
    },
  })
}
