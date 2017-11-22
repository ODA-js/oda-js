import { ResourceOperation } from "../resourceOperation";
import { IResourceOperation, refType } from "../interfaces";
import { reshape } from "oda-lodash";
import createField from './../../createField';
import createSingle from './../../createSingle';
import createMany from './../../createMany';

export default class extends ResourceOperation {
  constructor(options) {
    super(options);
    this.initDefaults(options);
  }
  initDefaults(options: IResourceOperation) {
    super.initDefaults(options);
  }
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
          this.resource.fields[f].ref.type === refType.hasMany || this.resource.fields[f].ref.type === refType.belongsToMany
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
