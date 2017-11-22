import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResource, IResourceOperationDefinition } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  constructor(options: IResourceOperationDefinition, resource?: IResource) {
    super(options, resource);
    this.initDefaults(options);
  }
  initDefaults(options: IResourceOperationDefinition) {
    super.initDefaults(options);
  }
  _parseResponse = (response) => {
    const data = reshape(this._resultQuery, response.data);
    return { data: data.item };
  }
  _variables = (params) => ({
    input: {
      id: params.id,
    },
  })
}
