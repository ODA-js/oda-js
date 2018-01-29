import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToManyRelationPropsStore,
  IBelongsToManyRelationProps,
  IBelongsToManyRelation,
  IRelationTransform,
} from '../interfaces/IBelongsToManyRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { RelationBase } from '../../model/index';
import { Relation } from './Relation';

// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: IBelongsToManyRelationPropsStore = {
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
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
    fields: transformMap<IField>(),
  };

// tslint:disable-next-line:variable-name
export const BelongsToManyStorage = Record(DefaultBelongsToMany);

export class BelongsToMany
  extends Relation<IBelongsToManyRelationProps, IBelongsToManyRelationPropsStore> implements IBelongsToManyRelation {
  public get verb(): 'BelongsToMany' {
    return 'BelongsToMany';
  }
  public get belongsToMany(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get using(): IEntityRef {
    return this.store.get('using', null);
  }

  protected transform(input: IBelongsToManyRelationProps): IBelongsToManyRelationPropsStore {
    return {
      ...input,
      single: false,
      stored: false,
      embedded: false,
      verb: 'BelongsToMany',
      fields: BelongsToManyTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IBelongsToManyRelationPropsStore): IBelongsToManyRelationProps {
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
      belongsToMany: input.belongsToMany,
      fields: BelongsToManyTransform.fields.reverse(input.fields),
      single: false,
      stored: false,
      embedded: false,
      using: input.using,
    };
  }
  constructor(init: IBelongsToManyRelationProps) {
    super();
    this.store = new BelongsToManyStorage(this.transform(init));
    this.init = new (Record<IBelongsToManyRelationProps>(init))();
  }
}
