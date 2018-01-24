import { IRelationPropsStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import { IHasManyRelationPropsStore, IHasManyRelationProps, IHasManyRelation } from '../interfaces/IHasManyRelation';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultHasMany: IHasManyRelationPropsStore = {
  modelType: 'relation',
  name: null,
  title: null,
  description: null,
  verb: null,
  ref: null,
  fields: null,
  opposite: null,
  hasMany: null,
};

// tslint:disable-next-line:variable-name
export const RelationTransform = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const HasManyStorage = Record(DefaultHasMany);

export class HasMany extends Persistent<IHasManyRelationProps, IHasManyRelationPropsStore> implements IHasManyRelation {
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

  public get verb(): 'HasMany' {
    return 'HasMany';
  }
  public get hasMany(): IEntityRef {
    return this.store.get('hasMany', null);
  }

  protected transform(input: IHasManyRelationProps): IHasManyRelationPropsStore {
    return {
      ...input,
      fields: RelationTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IHasManyRelationPropsStore): IHasManyRelationProps {
    return {
      ...input,
      fields: RelationTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IHasManyRelationProps) {
    super();
    this.store = new HasManyStorage(this.transform(init));
    this.init = new (Record<IHasManyRelationProps>(init))();
  }
}
