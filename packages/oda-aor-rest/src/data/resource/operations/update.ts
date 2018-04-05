import { reshape } from 'oda-lodash';

import { refType } from '../interfaces';
import ResourceOperation from '../resourceOperation';
import updateField from './../../updateField';
import updateMany from './../../updateMany';
import updateSingle from './../../updateSingle';

export default class extends ResourceOperation {
  public get query(): any {
    return this.resource.queries.update(this.resource.fragments, this.resource.queries);
  }
  public get resultQuery(): any {
    return this.resource.queries.updateResult(this.resource.fragments, this.resource.queries);
  }
  constructor(options) {
    super(options);
    if (!this._parseResponse) {
      this._parseResponse = (response) => {
        const data = reshape(this.resultQuery, response.data);
        return { data: data.item };
      }
    }

    if (!this._shouldFakeExecute) {
      this._shouldFakeExecute = (variables: { input: object, files: any }) => {
        return (Object.keys(variables.input).length === 1 && !variables.files) ? { data: variables.input } : false;
      }
    }

    if (!this._variables) {
      this._variables = (params) => {
        const { data, previousData } = params;
        const result: { input?: any, files?: any } = {};
        let input = {
          id: data.id,
        };
        Object.keys(this.resource.fields).forEach(f => {
          if (this.resource.fields[f].ref) {
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
        if (data.files) {
          result.files = data.files;
        }
        result.input = input;
        return result;
      }
    }
  }
}
