import { Record } from 'immutable';

import { IEntityRef } from '../interfaces/IEntityRef';
import { IHasMany, IHasManyInit, IHasManyStore, IRelationTransform } from '../interfaces/IHasMany';
import { Relation } from './Relation';
import { TransformField, TransformRef } from './utils';
import { IFieldContext } from '../contexts/IFieldContext';

// tslint:disable-next-line:variable-name
export const DefaultHasMany: IHasManyStore = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  hasMany: null,
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
export const HasManyTransform: IRelationTransform = {
  hasMany: TransformRef(),
  fields: TransformField(),
};

// tslint:disable-next-line:variable-name
export const HasManyStorage = Record(DefaultHasMany);

export class HasMany extends Relation<IHasManyInit, IHasManyStore> implements IHasMany {
  public get verb(): 'HasMany' {
    return 'HasMany';
  }
  public get ref(): IEntityRef {
    return this.store.get('hasMany', null);
  }
  public get hasMany(): IEntityRef {
    return this.store.get('hasMany', null);
  }
  protected transform(input: Partial<IHasManyInit>): IHasManyStore {
    const result: IHasManyStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'hasMany') {
            result.hasMany = HasManyTransform.hasMany.transform(input.hasMany);
          } else if (f === 'fields') {
            result.fields = HasManyTransform.fields.transform(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Record<IHasManyStore> & Readonly<IHasManyStore>): IHasManyInit {
    const result: IHasManyInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'hasMany' || f === 'ref') {
            result.hasMany = HasManyTransform.hasMany.reverse(input.hasMany);
          } else if (f === 'fields') {
            result.fields = HasManyTransform.fields.reverse(input.fields);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init: Partial<IHasManyInit>, context: IFieldContext) {
    super(init, context);
    this.store = new HasManyStorage(this.transform(init));
    this.init = new (Record<Partial<IHasManyInit>>(init))();
  }
}
