import {IRelation, IRelationPropsStore, IRelationProps} from '../interfaces/IRelation';
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
import { RelationType } from '../interfaces/types';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: IBelongsToRelationPropsStore = {
  verb: null,
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

export abstract class Relation<P extends IRelationProps, S extends IRelationPropsStore> extends Persistent<P, S> implements IRelation {
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
  public get verb(): RelationType {
    return this.store.get('verb', null);
  }
  public get embedded(): boolean {
    return this.store.get('embedded', true);
  }
  public get single(): boolean {
    return this.store.get('single', true);
  }
  public get stored(): boolean {
    return this.store.get('stored', true);
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
}
