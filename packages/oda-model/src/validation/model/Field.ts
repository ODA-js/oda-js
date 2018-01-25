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
import { Relation } from '../interfaces/types';

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
  public get relation(): Relation {
    return this.store.get('relation', null);
  }
  protected transform(input: IFieldProps): IFieldPropsStore {
    return {
      ...input,
      args: FieldTransform.args.transform(input.args),
    };
  }
  protected reverse(input: IFieldPropsStore): IFieldProps {
    return {
      ...input,
      args: FieldTransform.args.reverse(input.args),
    };
  }
  constructor(init: IFieldProps) {
    super();
    this.store = new FieldStorage(this.transform(init));
    this.init = new (Record<IFieldProps>(init))();
  }
}
