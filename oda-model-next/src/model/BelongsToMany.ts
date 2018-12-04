import { Map, Record } from 'immutable';

import {
  IBelongsToMany,
  IBelongsToManyInit,
  IBelongsToManyStore,
  IRelationTransform,
} from '../interfaces/IBelongsToMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { EntityRef } from './EntityRef';
import { Field } from './Field';
import { Relation } from './Relation';
import { TransformRef, TransformField } from './utils';
import { IFieldContext } from '../contexts/IFieldContext';
import { Persistent } from './Persistent';

// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: IBelongsToManyStore = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
  using: null,
  //storage
  single: false,
  stored: false,
  embedded: false,
  // name
  fullName: null,
  normalName: null,
  shortName: null,
};

// tslint:disable-next-line:variable-name
export const BelongsToManyTransform: IRelationTransform = {
  belongsToMany: TransformRef(),
  fields: TransformField(),
  using: TransformRef(),
};

// tslint:disable-next-line:variable-name
export const BelongsToManyStorage = Record(DefaultBelongsToMany);

export class BelongsToMany
  extends Relation<IBelongsToManyInit, IBelongsToManyStore>
  implements IBelongsToMany {
  public get verb(): 'BelongsToMany' {
    return 'BelongsToMany';
  }
  public get ref(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get belongsToMany(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get using(): IEntityRef {
    return this.store.get('using', null);
  }

  protected transform(
    input: Partial<IBelongsToManyInit>,
  ): Partial<IBelongsToManyStore> {
    const result: IBelongsToManyStore = {} as any;
    if (input) {
      if (input instanceof Persistent) {
        input = input.toJS();
      }
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsToMany') {
            result.belongsToMany = BelongsToManyTransform.belongsToMany.transform(
              input.belongsToMany,
              this,
            );
          } else if (f === 'using') {
            result.using = BelongsToManyTransform.using.transform(
              input.using,
              this,
            );
          } else if (f === 'fields') {
            result.fields = BelongsToManyTransform.fields.transform(
              input.fields,
              this,
            );
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(
    input: Record<IBelongsToManyStore> & Readonly<IBelongsToManyStore>,
  ): Partial<IBelongsToManyInit> {
    const result: IBelongsToManyInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (core[f] !== undefined && core[f] !== null) {
            if (f === 'belongsToMany' || f === 'ref') {
              result.belongsToMany = BelongsToManyTransform.belongsToMany.reverse(
                input.belongsToMany,
              );
            } else if (f === 'using') {
              result.using = BelongsToManyTransform.using.reverse(input.using);
            } else if (f === 'fields') {
              result.fields = BelongsToManyTransform.fields.reverse(
                input.fields,
              );
            } else {
              result[f] = core[f];
            }
          }
        }
      }
    }
    return result;
  }

  constructor(init?: Partial<IBelongsToManyInit>, context?: IFieldContext) {
    super(init, context);
    this.store = new BelongsToManyStorage(this.transform(init));
  }
}
