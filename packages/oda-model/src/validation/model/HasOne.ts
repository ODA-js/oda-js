import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IHasOneRelationPropsStore,
  IHasOneRelationProps,
  IHasOneRelation,
  IRelationTransform,
} from '../interfaces/IHasOneRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { Relation } from './Relation';

// tslint:disable-next-line:variable-name
export const DefaultHasOne: IHasOneRelationPropsStore = {
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
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
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const HasOneStorage = Record(DefaultHasOne);

export class HasOne extends Relation<IHasOneRelationProps, IHasOneRelationPropsStore> implements IHasOneRelation {
  public get verb(): 'HasOne' {
    return 'HasOne';
  }
  public get hasOne(): IEntityRef {
    return this.store.get('hasOne', null);
  }
  protected transform(input: IHasOneRelationProps): IHasOneRelationPropsStore {
    return {
      ...input,
      single: true,
      stored: false,
      embedded: false,
      verb: 'HasOne',
      fields: HasOneTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IHasOneRelationPropsStore): IHasOneRelationProps {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      ref: input.ref,
      verb: input.verb,
      hasOne: input.hasOne,
      fields: HasOneTransform.fields.reverse(input.fields),
      single: true,
      stored: false,
      embedded: false,
    };
  }
  constructor(init: IHasOneRelationProps) {
    super();
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<IHasOneRelationProps>(init))();
  }
}
