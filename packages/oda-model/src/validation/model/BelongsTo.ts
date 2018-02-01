import { Relation } from './Relation';
import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToStore,
  IBelongsToInit,
  IBelongsTo,
  IRelationTransform,
} from '../interfaces/IBelongsTo';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { EntityRef } from './EntityRef';
import { inherits } from 'util';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: Partial<IBelongsToStore> = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  belongsTo: null,
  //storage
  single: true,
  stored: true,
  embedded: true,
  // name
  fullName: null,
  normalName: null,
  shortName: null,
};

// tslint:disable-next-line:variable-name
export const BelongsToTransform: IRelationTransform = {
  belongsTo: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToStorage = Record(DefaultBelongsTo);

export class BelongsTo extends Relation<IBelongsToInit, IBelongsToStore> implements IBelongsTo {
  public get verb(): 'BelongsTo' {
    return 'BelongsTo';
  }
  public get ref(): IEntityRef {
    return this.store.get('belongsTo', null);
  }
  public get belongsTo(): IEntityRef {
    return this.store.get('belongsTo', null);
  }

  protected transform(input: Partial<IBelongsToInit>): IBelongsToStore {
    const result: IBelongsToStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.belongsTo = BelongsToTransform.belongsTo.transform(input.belongsTo);
          } else if (f === 'fields') {
            result.fields = BelongsToTransform.fields.transform(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: IBelongsToStore): IBelongsToInit {
    const result: IBelongsToInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.belongsTo = BelongsToTransform.belongsTo.reverse(input.belongsTo);
          } else if (f === 'fields') {
            result.fields = BelongsToTransform.fields.reverse(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IBelongsToInit>) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<Partial<IBelongsToInit>>(init))();
  }
}
