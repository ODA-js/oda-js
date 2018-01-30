import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IHasManyStore,
  IHasManyInit,
  IHasMany,
  IRelationTransform,
} from '../interfaces/IHasMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { Relation } from './Relation';

// tslint:disable-next-line:variable-name
export const DefaultHasMany: IHasManyStore = {
  name: null,
  title: null,
  description: null,
  verb: null,
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
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const HasManyStorage = Record(DefaultHasMany);

export class HasMany extends Relation<IHasManyInit, IHasManyStore> implements IHasMany {
  public get verb(): 'HasMany' {
    return 'HasMany';
  }
  public get hasMany(): IEntityRef {
    return this.store.get('hasMany', null);
  }
  protected transform(input: IHasManyInit): IHasManyStore {
    return {
      ...input,
      single: false,
      stored: false,
      embedded: false,
      verb: 'HasMany',
      fields: HasManyTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IHasManyStore): IHasManyInit {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      verb: input.verb,
      hasMany: input.hasMany,
      fields: HasManyTransform.fields.reverse(input.fields),
      single: false,
      stored: false,
      embedded: false,
    };
  }
  constructor(init: IHasManyInit) {
    super();
    this.store = new HasManyStorage(this.transform(init));
    this.init = new (Record<IHasManyInit>(init))();
  }
}
