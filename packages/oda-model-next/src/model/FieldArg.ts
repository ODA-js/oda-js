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
import {
  IField,
  IFieldACL,
  IFieldInit,
  IFieldStore,
  IFieldTransform,
} from '../interfaces/IField';
import {
  IFieldArgInit,
  IFieldArg,
  IFieldArgStore,
} from '../interfaces/IFieldArg';
import { IHasManyInit } from '../interfaces/IHasMany';
import { IHasOneInit } from '../interfaces/IHasOne';
import { IRelation, IRelationInit } from '../interfaces/IRelation';
import { BelongsTo, BelongsToTransform } from './BelongsTo';
import { BelongsToMany, BelongsToManyTransform } from './BelongsToMany';
import { HasMany, HasManyTransform } from './HasMany';
import { HasOne, HasOneTransform } from './HasOne';
import { Persistent } from './Persistent';
import { TransformArgs } from './utils';
import { IFieldContext } from '../contexts/IFieldContext';
import { IMutationContext } from '../contexts/IMutationContext';

// tslint:disable-next-line:variable-name
export const DefaultField: IFieldArgStore = {
  name: null,
  title: null,
  description: null,
  required: null,
  type: null,
  defaultValue: null,
};

// tslint:disable-next-line:variable-name
export const FieldStorage = Record(DefaultField);

export class FieldArg
  extends Persistent<
    IFieldArgInit,
    IFieldArgStore,
    IMutationContext | IFieldContext
  >
  implements IFieldArg {
  public get modelType(): 'fieldArg' {
    return 'fieldArg';
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
  public get required(): boolean {
    return this.store.get('required', null);
  }
  public get defaultValue(): string {
    return this.store.get('defaultValue', null);
  }
  protected transform(input: Partial<IFieldArgInit>): IFieldArgInit {
    const result: IFieldArgInit = {} as any;
    if (input) {
      if (input instanceof Persistent) {
        input = input.toJS();
      }
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          result[f] = input[f];
        }
      }
    }
    return result;
  }
  protected reverse(
    input: Record<IFieldArgStore> & Readonly<IFieldArgStore>,
  ): IFieldArgInit {
    const result: IFieldArgInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (core[f] !== undefined && core[f] !== null) {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }
  constructor(
    init?: Partial<IFieldArgInit>,
    context?: IMutationContext | IFieldContext,
  ) {
    super(context);
    this.store = new FieldStorage(this.transform(init));
  }
}
