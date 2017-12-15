import get from './../lib/json/get';
import set from './../lib/json/set';
import { MetadataInput, IValidate, IValidationResult } from './interfaces';
import deepMerge from './../lib/json/deepMerge';
import clean from '../lib/json/clean';
import { ModelPackage } from './modelpackage';

export class Metadata implements IValidate {
  public metadata: { [key: string]: any };

  public validate(pkg?: ModelPackage): IValidationResult[] {
    return [];
  }

  constructor(inp: { metadata?: { [key: string]: any } }) {
    if (inp && inp.metadata) {
      this.setMetadata('*', inp.metadata);
    }
  }

  public getMetadata(key?: string, def?: any): any {
    if (!key) {
      return this.metadata;
    } else {
      let result = get(this.metadata, key);
      if (result === undefined && def !== undefined) {
        this.setMetadata(key, def);
      }
      return result !== undefined ? result : def;
    }
  }

  public setMetadata(key?: string | { [key: string]: any }, data?: { [key: string]: any } | any): any {
    if (typeof key !== 'string' && !data) {
      data = key; key = '*';
    }
    if (data !== undefined) {
      if (key === '*') {
        this.metadata = data as any;
      } else {
        if (!this.metadata) {
          this.metadata = {};
        }
        set(this.metadata, key, data);
      }
    }
  }

  public updateWith(obj: MetadataInput) {
    if (obj && obj.metadata) {
      this.metadata = deepMerge(this.metadata || {}, obj.metadata);
    }
  }

  public toObject(): { [key: string]: any } {
    return clean({
      metadata: this.metadata,
    });
  }

  public toJSON(): { [key: string]: any } {
    return clean({
      metadata: this.metadata,
    });
  }
}
