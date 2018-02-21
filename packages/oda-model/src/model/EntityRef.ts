import camelcase from 'camelcase';
import { Record } from 'immutable';
import * as inflected from 'inflected';

import { DEFAULT_ID_FIELDNAME, REF_PATTERN } from '../definitions';
import { IEntityRef, IEntityRefInit, IEntityRefStore } from '../interfaces/IEntityRef';
import { Persistent } from './Persistent';
import { IRelationContext } from '../contexts/IRelationContext';

// tslint:disable-next-line:variable-name
export const DefaultEntityRef: IEntityRefStore = {
  backField: '',
  entity: '',
  field: '',
};

// tslint:disable-next-line:variable-name
export const EntityRefStorage = Record(DefaultEntityRef);

export class EntityRef extends Persistent<IEntityRefInit, IEntityRefStore, IRelationContext>
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

  protected reverse(input: Record<IEntityRefStore> & Readonly<IEntityRefStore>): IEntityRef {
    const result: IEntityRef = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          result[f] = core[f];
        }
      }
    }
    return result;
  }

  constructor(init: string | Partial<IEntityRef> = {}) {
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
