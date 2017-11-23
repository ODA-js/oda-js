import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResource, IResourceOperationDefinition } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  _parseResponse = (response) => {
    debugger
    const data = reshape(this._resultQuery, response.data);
    return { data: data.item };
  }
  _variables = (params) => ({
    id: params.id,
  })
}
