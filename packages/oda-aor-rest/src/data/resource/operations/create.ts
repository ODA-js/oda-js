import ResourceOperation from "../resourceOperation";
import { IResourceOperation, refType, IResource, IResourceOperationDefinition } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  _parseResponse = (response) => {
    const data = reshape(this._resultQuery, response.data);
    return { data: data.item };
  }
  _variables = (params) => {
    const { data } = params;
    let input = {};
    Object.keys(this.resource.fields).forEach(f => {
      if (!this.resource.fields[f].ref) {
        if (
          this.resource.fields[f].ref.type === refType.HasMany || this.resource.fields[f].ref.type === refType.BelongsToMany
        ) {
          input = {
            ...input,
            ...createMany(data, {
              name: f,
              ...this.resource.fields[f]
            }, this.resource.resourceContainer),
          };
        } else {
          input = {
            ...input,
            ...createSingle(data, {
              name: f,
              ...this.resource.fields[f],
            }, this.resource.resourceContainer),
          };
        }
      } else {
        input = {
          ...input,
          ...createField(data, f),
        };
      }
    });
    return { input };
  }
}
