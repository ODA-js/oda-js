import { Record } from 'immutable';
import { Map, Set } from 'immutable';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IFieldACL,
  IFieldProps,
  IFieldPropsStore,
  IFieldArgs,
  IFieldTransform,
} from '../interfaces/IField';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { RelationUnion, RelationPropsUnion } from '../interfaces/types';
import { IBelongsToRelationProps, IsBelongsToProps } from '../interfaces/IBelongsToRelation';
import { IBelongsToManyRelationProps, IsBelongsToManyProps } from '../interfaces/IBelongsToManyRelation';
import { IHasOneRelationProps, IsHasOneProps } from '../interfaces/IHasOneRelation';
import { IHasManyRelationProps, IsHasManyProps } from '../interfaces/IHasManyRelation';
import { IRelationProps } from '../interfaces/IRelation';
import { BelongsTo } from './BelongsTo';
import { BelongsToMany } from './BelongsToMany';
import { HasOne } from './HasOne';
import { HasMany } from './HasMany';
import { IsBelongsTo, IsBelongsToMany, IsHasOne, IsHasMany } from '../helpers';

// tslint:disable-next-line:variable-name
export const DefaultField: IFieldPropsStore = {
  name: null,
  title: null,
  description: null,
  acl: null,
  args: null,
  derived: null,
  entity: null,
  identity: null,
  idKey: null,
  indexed: null,
  order: null,
  persistent: null,
  relation: null,
  required: null,
  type: null,
};

// tslint:disable-next-line:variable-name
export const FieldTransform: IFieldTransform = {
  args: transformMap<IFieldArgs>(),
  relation: {
    transform: (inp: RelationPropsUnion): RelationUnion => {
      if (IsBelongsToProps(inp)) {
        return new BelongsTo(inp);
      }
      if (IsBelongsToManyProps(inp)) {
        return new BelongsToMany(inp);
      }
      if (IsHasOneProps(inp)) {
        return new HasOne(inp);
      }
      if (IsHasManyProps(inp)) {
        return new HasMany(inp);
      }
    },
    reverse: (inp: RelationUnion): RelationPropsUnion => {
      if (IsBelongsTo(inp)) {
        return BelongsTo(inp);
      }
      if (IsBelongsToMany(inp)) {
        return new BelongsToMany(inp);
      }
      if (IsHasOne(inp)) {
        return new HasOne(inp);
      }
      if (IsHasMany(inp)) {
        return new HasMany(inp);
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const FieldStorage = Record(DefaultField);

export class Field extends Persistent<IFieldProps, IFieldPropsStore> implements IField {
  public get modelType(): 'field' {
    return 'field';
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
  public get acl(): Partial<IFieldACL> {
    return this.store.get('acl', null);
  }
  public get args(): Map<string, IFieldArgs> {
    return this.store.get('args', null);
  }
  public get derived(): boolean {
    return this.store.get('derived', null);
  }
  public get persistent(): boolean {
    return this.store.get('persistent', null);
  }
  public get required(): boolean {
    return this.store.get('required', null);
  }
  public get indexed(): boolean | string | string[] {
    return this.store.get('indexed', null);
  }
  public get identity(): boolean | string | string[] {
    return this.store.get('identity', null);
  }
  public get idKey(): IEntityRef {
    return this.store.get('idKey', null);
  }
  public get order(): number {
    return this.store.get('order', null);
  }
  public get relation(): RelationUnion {
    return this.store.get('relation', null);
  }
  protected transform(input: IFieldProps): IFieldPropsStore {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      entity: input.entity,
      type: input.type,
      acl: input.acl,
      args: FieldTransform.args.transform(input.args),
    };
  }
  protected reverse(input: IFieldPropsStore): IFieldProps {
    return {
      name: input.name,
      title: input.title,
      description: input.description,
      entity: input.entity,
      type: input.type,
      acl: input.acl,
      derived: input.derived,
      identity: input.identity,
      indexed: input.indexed,
      order: input.order,
      persistent: input.persistent,
      relation: FieldTransform.relation.reverse(input.relation),
      args: FieldTransform.args.reverse(input.args),
    };
  }
  constructor(init: IFieldProps) {
    super();
    this.store = new FieldStorage(this.transform(init));
    this.init = new (Record<IFieldProps>(init))();
  }
}
