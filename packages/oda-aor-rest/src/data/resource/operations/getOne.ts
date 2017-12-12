import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResource, IResourceOperationDefinition } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.getOne(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.getOneResult(this.resource.fragments, this.resource.queries);
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
        id: params.id,
      });
    }
  }
}
