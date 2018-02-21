import { Record } from 'immutable';

import { IBelongsTo, IBelongsToInit, IBelongsToStore, IRelationTransform } from '../interfaces/IBelongsTo';
import { IEntityRef } from '../interfaces/IEntityRef';
import { Relation } from './Relation';
import { TransformField, TransformRef } from './utils';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: IBelongsToStore = {
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
  belongsTo: TransformRef(),
  fields: TransformField(),
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

  protected transform(input: Partial<IBelongsToInit>): Partial<IBelongsToStore> {
    const result: Partial<IBelongsToStore> = {};
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

  protected reverse(input: Record<IBelongsToStore> & Readonly<IBelongsToStore>): Partial<IBelongsToInit> {
    const result: Partial<IBelongsToInit> = {};
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'belongsTo' || f === 'ref') {
            result.belongsTo = BelongsToTransform.belongsTo.reverse(input.belongsTo);
          } else if (f === 'fields') {
            result.fields = BelongsToTransform.fields.reverse(input.fields);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IBelongsToInit> = {}) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<Partial<IBelongsToInit>>(init))();
  }
}
