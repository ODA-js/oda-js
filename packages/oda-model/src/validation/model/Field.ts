import { Record } from 'immutable';
import { Map } from 'immutable';

import { IsBelongsTo, IsBelongsToMany, IsHasMany, IsHasOne } from '../helpers';
import { IBelongsToManyInit, IsBelongsToManyProps } from '../interfaces/IBelongsToMany';
import { IBelongsToInit, IsBelongsToProps } from '../interfaces/IBelongsTo';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { IFieldACL, IFieldArgs, IFieldInit, IFieldStore, IFieldTransform } from '../interfaces/IField';
import { IHasManyInit, IsHasManyProps } from '../interfaces/IHasMany';
import { IHasOneInit, IsHasOneProps } from '../interfaces/IHasOne';
import { RelationPropsUnion, RelationUnion } from '../interfaces/types';
import { BelongsTo, BelongsToTransform } from './BelongsTo';
import { BelongsToMany, BelongsToManyTransform } from './BelongsToMany';
import { HasMany, HasManyTransform } from './HasMany';
import { HasOne, HasOneTransform } from './HasOne';
import { Persistent } from './Persistent';
import { transformMap } from './utils';

// tslint:disable-next-line:variable-name
export const DefaultField: IFieldStore = {
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
        return {
          ...inp,
          fields: BelongsToTransform.fields.reverse(inp.fields),
        } as IBelongsToInit;
      }
      if (IsBelongsToMany(inp)) {
        return {
          ...inp,
          fields: BelongsToManyTransform.fields.reverse(inp.fields),
        } as IBelongsToManyInit;
      }
      if (IsHasOne(inp)) {
        return {
          ...inp,
          fields: HasOneTransform.fields.reverse(inp.fields),
        } as IHasOneInit;
      }
      if (IsHasMany(inp)) {
        return {
          ...inp,
          fields: HasManyTransform.fields.reverse(inp.fields),
        } as IHasManyInit;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const FieldStorage = Record(DefaultField);

export class Field extends Persistent<IFieldInit, IFieldStore> implements IField {
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
  protected transform(input: IFieldInit): IFieldStore {
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
  protected reverse(input: IFieldStore): IFieldInit {
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
  constructor(init: IFieldInit) {
    super();
    this.store = new FieldStorage(this.transform(init));
    this.init = new (Record<IFieldInit>(init))();
  }
}
