import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToManyRelationPropsStore,
  IBelongsToManyRelationProps,
  IBelongsToManyRelation,
} from '../interfaces/IBelongsToManyRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: IBelongsToManyRelationPropsStore = {
  modelType: 'relation',
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
};

// tslint:disable-next-line:variable-name
export const RelationTransform: {[k in keyof IBelongsToManyRelationPropsStore]?: any } = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToManyStorage = Record(DefaultBelongsToMany);

export class BelongsToMany
  extends Persistent<IBelongsToManyRelationProps, IBelongsToManyRelationPropsStore> implements IBelongsToManyRelation {
  public get modelType(): 'relation' {
    return 'relation';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get ref(): IEntityRef {
    return this.store.get('ref', null);
  }
  public get fields(): Map<string, IField> {
    return this.store.get('fields', null);
  }
  public get opposite(): string {
    return this.store.get('opposite', null);
  }

  public get verb(): 'BelongsToMany' {
    return 'BelongsToMany';
  }
  public get belongsToMany(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }

  protected transform(input: IBelongsToManyRelationProps): IBelongsToManyRelationPropsStore {
    return {
      ...input,
      fields: RelationTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IBelongsToManyRelationPropsStore): IBelongsToManyRelationProps {
    return {
      ...input,
      fields: RelationTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IBelongsToManyRelationProps) {
    super();
    this.store = new BelongsToManyStorage(this.transform(init));
    this.init = new (Record<IBelongsToManyRelationProps>(init))();
  }
}
