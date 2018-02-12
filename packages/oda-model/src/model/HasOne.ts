import { Map, Record } from 'immutable';

import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { IHasOne, IHasOneInit, IHasOneStore, IRelationTransform } from '../interfaces/IHasOne';
import { EntityRef } from './EntityRef';
import { Field } from './Field';
import { Relation } from './Relation';

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
  hasOne: {
    transform: (inp) => {
      if (inp) {
        return new EntityRef(inp);
      } else {
        return null;
      }
    },
    reverse: (inp) => {
      if (inp) {
        return inp.toString();
      } else {
        return null;
      }
    },
  },
  fields: {
    transform:  (input: IFieldInit[]) => {
      if (input) {
        return Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]);
      } else {
        return null;
      }
    },
    reverse : (input: Map<string, IField>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS());
      } else {
        return null;
      }
    },
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
  protected reverse(input: Record<IHasOneStore> & Readonly<IHasOneStore>): IHasOneInit {
    const result: IHasOneInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
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
  constructor(init: Partial<IHasOneInit> = {}) {
    super();
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<Partial<IHasOneInit>>(init))();
  }
}
