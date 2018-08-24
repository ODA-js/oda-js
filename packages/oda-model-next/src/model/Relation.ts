import { Map } from 'immutable';

import { IFieldContext } from '../contexts/IFieldContext';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import {
  IRelation,
  IRelationInit,
  IRelationStore,
} from '../interfaces/IRelation';
import { RelationType } from '../interfaces/types';
import { Persistent } from './Persistent';

export abstract class Relation<
  P extends Partial<IRelationInit>,
  S extends IRelationStore
> extends Persistent<P, S, IFieldContext> implements IRelation {
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
  constructor(init?: Partial<P>, context?: IFieldContext) {
    super();
    if (!context && init && init.fields) {
      throw new Error('conext must be provided');
    }
    if (context) {
      this.attach(context);
    }
  }
}
