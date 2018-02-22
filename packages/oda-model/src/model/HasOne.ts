import { Record } from 'immutable';

import { IEntityRef } from '../interfaces/IEntityRef';
import { IHasOne, IHasOneInit, IHasOneStore, IRelationTransform } from '../interfaces/IHasOne';
import { Relation } from './Relation';
import { TransformField, TransformRef } from './utils';
import { IFieldContext } from '../contexts/IFieldContext';

// tslint:disable-next-line:variable-name
export const DefaultHasOne: IHasOneStore = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  hasOne: null,
  //storage
  single: true,
  stored: false,
  embedded: false,
  // name
  fullName: null,
  normalName: null,
  shortName: null,
};

// tslint:disable-next-line:variable-name
export const HasOneTransform: IRelationTransform = {
  hasOne: TransformRef(),
  fields: TransformField(),
};

// tslint:disable-next-line:variable-name
export const HasOneStorage = Record(DefaultHasOne);

export class HasOne extends Relation<IHasOneInit, IHasOneStore> implements IHasOne {
  public get verb(): 'HasOne' {
    return 'HasOne';
  }
  public get ref(): IEntityRef {
    return this.store.get('hasOne', null);
  }
  public get hasOne(): IEntityRef {
    return this.store.get('hasOne', null);
  }
  protected transform(input: Partial<IHasOneInit>): IHasOneStore {
    const result: IHasOneStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'hasOne') {
            result.hasOne = HasOneTransform.hasOne.transform(input.hasOne, this);
          } else if (f === 'fields') {
            result.fields = HasOneTransform.fields.transform(input.fields, this);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  protected reverse(input: Record<IHasOneStore> & Readonly<IHasOneStore>): IHasOneInit {
    const result: IHasOneInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'hasOne' || f === 'ref') {
            result.hasOne = HasOneTransform.hasOne.reverse(input.hasOne);
          } else if (f === 'fields') {
            result.fields = HasOneTransform.fields.reverse(input.fields);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init?: Partial<IHasOneInit>, context?: IFieldContext) {
    super(init, context);
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<Partial<IHasOneInit>>(init))();
  }
}
