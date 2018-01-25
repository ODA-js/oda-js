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
  public get embedded(): boolean {
    return this.store.get('embedded', null);
  }
  public get single(): boolean {
    return this.store.get('single', null);
  }
  public get stored(): boolean {
    return this.store.get('stored', null);
  }
  public get fullName(): string {
    return this.store.get('fullName', null);
  }
  public get normalName(): string {
    return this.store.get('normalName', null);
  }
  public get shortName(): string {
    return this.store.get('shortName', null);
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
      modelType: input.modelType,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      ref: input.ref,
      verb: input.verb,
      belongsTo: input.belongsTo,
      fields: RelationTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IBelongsToRelationProps) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<IBelongsToRelationProps>(init))();
  }
}
