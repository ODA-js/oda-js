import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import { IBelongsToRelationPropsStore, IBelongsToRelationProps, IBelongsToRelation } from '../interfaces/IBelongsToRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: IBelongsToRelationPropsStore = {
  modelType: 'relation',
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
  fields: null,
  opposite: null,
  belongsTo: null,
};

// tslint:disable-next-line:variable-name
export const RelationTransform: {[k in keyof IBelongsToRelationPropsStore]?: any } = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToStorage = Record(DefaultBelongsTo);

export class BelongsTo extends Persistent<IBelongsToRelationProps, IBelongsToRelationPropsStore> implements IBelongsToRelation {
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

  public get verb(): 'BelongsTo' {
    return 'BelongsTo';
  }
  public get belongsTo(): IEntityRef {
    return this.store.get('belongsTo', null);
  }

  protected transform(input: IBelongsToRelationProps): IBelongsToRelationPropsStore {
    return {
      ...input,
      fields: RelationTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IBelongsToRelationPropsStore): IBelongsToRelationProps {
    return {
      ...input,
      fields: RelationTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IBelongsToRelationProps) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<IBelongsToRelationProps>(init))();
  }
}
