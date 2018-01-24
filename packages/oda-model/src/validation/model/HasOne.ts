import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import { IHasOneRelationPropsStore, IHasOneRelationProps, IHasOneRelation } from '../interfaces/IHasOneRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultHasOne: IHasOneRelationPropsStore = {
  modelType: 'relation',
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
  fields: null,
  opposite: null,
  hasOne: null,
};

// tslint:disable-next-line:variable-name
export const RelationTransform: { [ k in keyof IHasOneRelationPropsStore]?: any }  = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const HasOneStorage = Record(DefaultHasOne);

export class HasOne extends Persistent<IHasOneRelationProps, IHasOneRelationPropsStore> implements IHasOneRelation {
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

  public get verb(): 'HasOne' {
    return 'HasOne';
  }
  public get hasOne(): IEntityRef {
    return this.store.get('hasOne', null);
  }

  protected transform(input: IHasOneRelationProps): IHasOneRelationPropsStore {
    return {
      ...input,
      fields: RelationTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IHasOneRelationPropsStore): IHasOneRelationProps {
    return {
      ...input,
      fields: RelationTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IHasOneRelationProps) {
    super();
    this.store = new HasOneStorage(this.transform(init));
    this.init = new (Record<IHasOneRelationProps>(init))();
  }
}
