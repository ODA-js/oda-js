import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet, convertMap } from './utils';
import {
  IHasManyStore,
  IHasManyInit,
  IHasMany,
  IRelationTransform,
} from '../interfaces/IHasMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { Relation } from './Relation';
import { EntityRef } from './EntityRef';

// tslint:disable-next-line:variable-name
export const DefaultHasMany: Partial<IHasManyStore> = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  hasMany: null,
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
export const HasManyTransform: IRelationTransform = {
  hasMany: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: convertMap<IField, Partial<IField>>((inp: IField) => {
    return inp;
  },
    (inp: Partial<IField>) => {
    return inp as IField;
}  ),
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
          if (f === 'belongsTo') {
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

  protected reverse(input: IHasManyStore): IHasManyInit {
    const result: IHasManyInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.hasMany = HasManyTransform.hasMany.reverse(input.hasMany);
          } else if (f === 'fields') {
            result.fields = HasManyTransform.fields.reverse(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init: Partial<IHasManyInit> = {}) {
    super();
    this.store = new HasManyStorage(this.transform(init));
    this.init = new (Record<Partial<IHasManyInit>>(init))();
  }
}
