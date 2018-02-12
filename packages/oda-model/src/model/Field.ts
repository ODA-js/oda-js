import { Map, Record } from 'immutable';

import {
  IsBelongsTo,
  IsBelongsToMany,
  IsBelongsToManyProps,
  IsBelongsToProps,
  IsHasMany,
  IsHasManyProps,
  IsHasOne,
  IsHasOneProps,
} from '../helpers';
import { IBelongsToInit } from '../interfaces/IBelongsTo';
import { IBelongsToManyInit } from '../interfaces/IBelongsToMany';
import { IEntity } from '../interfaces/IEntity';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldACL, IFieldArgs, IFieldInit, IFieldStore, IFieldTransform } from '../interfaces/IField';
import { IHasManyInit } from '../interfaces/IHasMany';
import { IHasOneInit } from '../interfaces/IHasOne';
import { IRelation, IRelationInit } from '../interfaces/IRelation';
import { BelongsTo, BelongsToTransform } from './BelongsTo';
import { BelongsToMany, BelongsToManyTransform } from './BelongsToMany';
import { HasMany, HasManyTransform } from './HasMany';
import { HasOne, HasOneTransform } from './HasOne';
import { Persistent } from './Persistent';

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
export const FieldTransform: Partial<IFieldTransform> = {
  args: {
    transform: (input: IFieldArgs[]) => {
      if (input) {
        return Map<string, IFieldArgs>(input.map(p => [p.name, p]) as [string, IFieldArgs][]);
      } else {
        return null;
      }
    },
    reverse: (input: Map<string, IFieldArgs>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]());
      } else {
        return null;
      }
    },
  },
  relation: {
    transform: (inp: Partial<IRelationInit>): IRelation => {
      if (inp) {
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
      } else {
        return null;
      }
    },
    reverse: (inp: IRelation): Partial<IRelationInit> => {
      if (inp) {
        if (IsBelongsTo(inp)) {
          return {
            ...inp,
            belongsTo: BelongsToTransform.belongsTo.reverse(inp.belongsTo),
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
      } else {
        return null;
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
  public get entity(): IEntity {
    return this.store.get('entity', null);
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
  public get type(): string {
    return this.store.get('type', null);
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
  public get relation(): IRelation {
    return this.store.get('relation', null);
  }
  protected transform(input: Partial<IFieldInit>): IFieldStore {
    const result: IFieldStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = FieldTransform.args.transform(input.args);
          } else if (f === 'relation') {
            result.relation = FieldTransform.relation.transform(input.relation);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  protected reverse(input: Record<IFieldStore> & Readonly<IFieldStore>): IFieldInit {
    const result: IFieldInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = FieldTransform.args.reverse(input.args);
          } else if (f === 'relation') {
            result.relation = FieldTransform.relation.reverse(input.relation);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init: Partial<IFieldInit>  = {}) {
    super();
    this.store = new FieldStorage(this.transform(init));
    this.init = new (Record<Partial<IFieldInit>>(init))();
  }
}
