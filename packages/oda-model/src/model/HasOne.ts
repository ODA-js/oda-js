import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IHasOneStore,
  IHasOneInit,
  IHasOne,
  IRelationTransform,
} from '../interfaces/IHasOne';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { Relation } from './Relation';
import { EntityRef } from './EntityRef';
import { Field } from './Field';

// tslint:disable-next-line:variable-name
export const DefaultHasOne: Partial<IHasOneStore> = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  hasOne: null,
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
export const HasOneTransform: IRelationTransform = {
  hasOne: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: {
    transform: (input: IFieldInit[]) => Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]),
    reverse: (input: Map<string, IField>) => Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS()),
  },
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
          if (f === 'belongsTo') {
            result.hasOne = HasOneTransform.hasOne.transform(input.hasOne);
          } else if (f === 'fields') {
            result.fields = HasOneTransform.fields.transform(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  protected reverse(input: IHasOneStore): IHasOneInit {
    const result: IHasOneInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.hasOne = HasOneTransform.hasOne.reverse(input.hasOne);
          } else if (f === 'fields') {
            result.fields = HasOneTransform.fields.reverse(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init: Partial<IHasOneInit> = {}) {
    super();
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<Partial<IHasOneInit>>(init))();
  }
}
