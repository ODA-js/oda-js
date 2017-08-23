import get from './../lib/json/get';
import set from './../lib/json/set';
import { MetadataInput } from './interfaces';
import deepMerge from './../lib/json/deepMerge';

export class Metadata {

  public metadata: { [key: string]: any };

  constructor(inp: { metadata?: { [key: string]: any } }) {
    this.setMetadata('*', inp.metadata);
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
    return {
      metadata: this.metadata,
    };
  }

  public toJSON(): { [key: string]: any } {
    return {
      metadata: this.metadata,
    };
  }
}
