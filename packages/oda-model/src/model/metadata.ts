import clean from '../lib/json/clean';
import deepMerge from './../lib/json/deepMerge';
import get from './../lib/json/get';
import set from './../lib/json/set';
import {
  MetadataInput, MetaModelStore,
} from './interfaces';
import { IValidate } from '../validation/interfaces/IValidate';
import { MetaModelType } from '../validation/interfaces/types';
import { IValidator } from '../validation/interfaces/IValidator';
import { IValidationResult } from '../validation/interfaces/IValidationResult';

export class Metadata<MetaFormat extends Object> implements IValidate {
  public get metadata(): MetaFormat {
    return this._metadata || {} as MetaFormat;
  }

  protected _metadata: MetaFormat;

  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }

  constructor(inp: { metadata?: MetaFormat}) {
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
        this._metadata = data as any;
      } else {
        if (!this._metadata) {
          this._metadata = {} as MetaFormat;
        }
        set(this._metadata, key, data);
      }
    }
  }

  public updateWith(obj: MetadataInput) {
    if (obj && obj.metadata) {
      this._metadata = deepMerge(this.metadata || {}, obj.metadata);
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
