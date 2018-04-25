import { reshape } from 'oda-lodash';

import { refType } from '../interfaces';
import ResourceOperation from '../resourceOperation';
import createField from './../../createField';
import createMany from './../../createMany';
import createSingle from './../../createSingle';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.create(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.createResult(this.resource.fragments, this.resource.queries);
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
      this._variables = (params) => {
        const { data } = params;
        const result: { input?: any, files?: any } = {};
        let input = {};
        Object.keys(this.resource.fields).forEach(f => {
          if (this.resource.fields[f].ref) {
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
        if (data.files) {
          result.files = data.files;
        }
        result.input = input;
        return result;
      };
    }
  }
}
