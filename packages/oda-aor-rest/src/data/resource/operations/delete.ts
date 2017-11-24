import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResourceOperationDefinition, IResource } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.delete(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.deleteResult(this.resource.fragments, this.resource.queries);
  }
  _parseResponse = (response) => {
    // debugger
    const data = reshape(this.resultQuery, response.data);
    return { data: data.item };
  }
  _variables = (params) => ({
    input: {
      id: params.id,
    },
  })
}
