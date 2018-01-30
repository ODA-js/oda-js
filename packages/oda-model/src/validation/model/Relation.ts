import {IRelation, IRelationStore, IRelationInit} from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToStore,
  IBelongsToInit,
  IBelongsTo,
  IRelationTransform,
} from '../interfaces/IBelongsTo';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { RelationType } from '../interfaces/types';

export abstract class Relation<P extends IRelationInit, S extends IRelationStore> extends Persistent<P, S> implements IRelation {
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
    throw new Error('not implemented');
  }
  public get fields(): Map<string, IField> {
    return this.store.get('fields', null);
  }
  public get opposite(): string {
    return this.store.get('opposite', null);
  }
  public get verb(): RelationType {
    throw new Error('not implemented');
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
