import {Relation} from './Relation';
import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToRelationPropsStore,
  IBelongsToRelationProps,
  IBelongsToRelation,
  IRelationTransform,
} from '../interfaces/IBelongsToRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: IBelongsToRelationPropsStore = {
  verb: 'BelongsTo',
  name: null,
  title: null,
  description: null,
  ref: null,
  fields: null,
  opposite: null,
  belongsTo: null,
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
export const RelationTransform: IRelationTransform = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToStorage = Record(DefaultBelongsTo);

export class BelongsTo extends Relation<IBelongsToRelationProps, IBelongsToRelationPropsStore> implements IBelongsToRelation {
  public get verb(): 'BelongsTo' {
    return 'BelongsTo';
  }
  public get belongsTo(): IEntityRef {
    return this.store.get('belongsTo', null);
  }

  protected transform(input: IBelongsToRelationProps): IBelongsToRelationPropsStore {
    return {
      ...input,
      single: true,
      stored: true,
      embedded: true,
      verb: 'BelongsTo',
      fields: RelationTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IBelongsToRelationPropsStore): IBelongsToRelationProps {
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
      belongsTo: input.belongsTo,
      fields: RelationTransform.fields.reverse(input.fields),
      single: true,
      stored: true,
      embedded: true,
    };
  }
  constructor(init: IBelongsToRelationProps) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<IBelongsToRelationProps>(init))();
  }
}
