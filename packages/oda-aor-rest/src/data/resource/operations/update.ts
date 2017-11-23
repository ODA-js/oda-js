import ResourceOperation from "../resourceOperation";
import { IResourceOperation, refType, IResourceOperationDefinition, IResource } from "../interfaces";
import { reshape } from "oda-lodash";
import updateField from './../../updateField';
import updateSingle from './../../updateSingle';
import updateMany from './../../updateMany';

export default class extends ResourceOperation {
  _parseResponse = (response) => {
    debugger
    const data = reshape(this._resultQuery, response.data);
    return { data: data.item };
  }
  _variables = (params) => {
    const { data, previousData } = params;
    let input = {};
    Object.keys(this.resource.fields).forEach(f => {
      if (!this.resource.fields[f].ref.type) {
        if (
          this.resource.fields[f].ref.type === refType.HasMany || this.resource.fields[f].ref.type === refType.BelongsToMany
        ) {
          input = {
            ...input,
            ...updateMany(data, previousData, {
              name: f,
              ...this.resource.fields[f]
            }, this.resource.resourceContainer),
          };
        } else {
          input = {
            ...input,
            ...updateSingle(data, previousData, {
              name: f, ...this.resource.fields[f]
            }, this.resource.resourceContainer),
          };
        }
      } else {
        input = {
          ...input,
          ...updateField(data, previousData, f),
        };
      }
    });
    return { input };
  }
}
