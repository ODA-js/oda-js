import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToManyStore,
  IBelongsToManyInit,
  IBelongsToMany,
  IRelationTransform,
} from '../interfaces/IBelongsToMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { RelationBase } from '../../model/index';
import { Relation } from './Relation';
import { EntityRef } from './EntityRef';

// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: IBelongsToManyStore = {
  name: null,
  title: null,
  description: null,
  verb: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
  using: null,
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
export const BelongsToManyTransform: IRelationTransform = {
  belongsToMany: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  using: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToManyStorage = Record(DefaultBelongsToMany);

export class BelongsToMany
  extends Relation<IBelongsToManyInit, IBelongsToManyStore> implements IBelongsToMany {
  public get verb(): 'BelongsToMany' {
    return 'BelongsToMany';
  }
  public get belongsToMany(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get using(): IEntityRef {
    return this.store.get('using', null);
  }

  protected transform(input: IBelongsToManyInit): IBelongsToManyStore {
    return {
      ...input,
      single: false,
      stored: false,
      embedded: false,
      verb: 'BelongsToMany',
      belongsToMany: BelongsToManyTransform.belongsToMany.transform(input.belongsToMany),
      using: BelongsToManyTransform.using.transform(input.using),
      fields: BelongsToManyTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IBelongsToManyStore): IBelongsToManyInit {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      verb: input.verb,
      belongsToMany: BelongsToManyTransform.belongsToMany.reverse(input.belongsToMany),
      fields: BelongsToManyTransform.fields.reverse(input.fields),
      single: false,
      stored: false,
      embedded: false,
      using: input.using,
    };
  }
  constructor(init: IBelongsToManyInit) {
    super();
    this.store = new BelongsToManyStorage(this.transform(init));
    this.init = new (Record<IBelongsToManyInit>(init))();
  }
}
