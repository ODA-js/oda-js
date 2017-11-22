import ResourceOperation from "../resourceOperation";
import { IResourceOperation, IResourceOperationDefinition, IResource } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
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
