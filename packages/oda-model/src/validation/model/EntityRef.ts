import { Record } from 'immutable';
import * as camelcase from 'camelcase';
import * as inflected from 'inflected';

import { DEFAULT_ID_FIELDNAME, REF_PATTERN } from '../../definitions';
import { IEntityRef } from '../interfaces/IEntityRef';
import { Persistent } from './Persistent';

// tslint:disable-next-line:variable-name
export const DefaultEntityRef: Partial<IEntityRef> = {
  backField: '',
  entity: '',
  field: '',
};

// tslint:disable-next-line:variable-name
export const EntityRefStorage = Record(DefaultEntityRef);

export class EntityRef extends Persistent<IEntityRef, IEntityRef>
  implements IEntityRef {
  public get backField(): string {
    return this.store.get('backField', '');
  }
  public get entity(): string {
    return this.store.get('entity', '');
  }
  public get field(): string {
    return this.store.get('field', '');
  }

  public toString(): string {
    return `${this.backField ? (this.backField + '@') : ''}${this.entity}#${this.field || DEFAULT_ID_FIELDNAME}`;
  }

  protected transform(input: Partial<IEntityRef>): IEntityRef {
    const result: IEntityRef = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          result[f] = input[f];
        }
      }
    }
    return result;
  }

  protected reverse(input: IEntityRef): IEntityRef {
    const result: IEntityRef = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          result[f] = input[f];
        }
      }
    }
    return result;
  }

  constructor(init: string | IEntityRef) {
    super();
    if (typeof init === 'string') {
      let res = init.match(REF_PATTERN);
      if (res && res.length > 0) {
        this.store = new EntityRefStorage(this.transform({
          backField: res[1],
          entity: inflected.classify(res[2]),
          field: camelcase(res[3].trim()),
        }));
      }
    } else {
      this.store = new EntityRefStorage(this.transform(init));
    }
  }
}
