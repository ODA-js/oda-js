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
import { IField } from '../interfaces/IField';
import { Relation } from './Relation';
import { EntityRef } from './EntityRef';

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
  fields: transformMap<IField>(),
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
  protected transform(input: IHasOneInit): IHasOneStore {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      single: true,
      stored: false,
      embedded: false,
      hasOne: HasOneTransform.hasOne.transform(input.hasOne),
      fields: HasOneTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IHasOneStore): IHasOneInit {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      hasOne: input.hasOne,
      fields: HasOneTransform.fields.reverse(input.fields),
      single: true,
      stored: false,
      embedded: false,
    };
  }
  constructor(init: IHasOneInit) {
    super();
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<IHasOneInit>(init))();
  }
}
