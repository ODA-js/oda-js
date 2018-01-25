import { IModel } from '../interfaces/IModel';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IEntityPropsStore,
  IEntity,
  IEntityProps,
  IEntityTransform,
} from '../interfaces/IEntity';
import { IField } from '../interfaces/IField';


// tslint:disable-next-line:variable-name
export const DefaultEntity: IEntityPropsStore = {
  modelType: 'entity',
  name: null,
  title: null,
  description: null,
  acl: null,
  plural: null,
  singular: null,
  fields: Map<string, IField>(),
  storage: null,
};

// tslint:disable-next-line:variable-name
export const EntityTransform: IEntityTransform = {
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const EntityStorage = Record(DefaultEntity);

export class Model extends Persistent<IEntityProps, IEntityPropsStore> implements IEntity {
  public get modelType(): 'entity' {
    return 'entity';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get acl() {
    return this.store.get('acl', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get singular(): string {
    return this.store.get('singular', null);
  }
  public get plural(): string {
    return this.store.get('plural', null);
  }
  public get fields(): Map<string, IField> {
    return this.store.get('fields', null);
  }
  public get relations(): Set<string> {
    return this.store.get('relations', null);
  }
  public get required(): Set<string> {
    return this.store.get('required', null);
  }
  public get indexed(): Set<string> {
    return this.store.get('indexed', null);
  }

  protected transform(input: IEntityProps): IEntityPropsStore {
    return {
      ...input,
      fields: EntityTransform.fields.transform(input.fields),
    };
  }
  protected reverse(input: IEntityPropsStore): IEntityProps {
    return {
      name: input.name,
      title: input.name,
      description: input.name,
      plural: input.plural,
      singular: input.singular,
      modelType: 'entity',
      acl: input.acl,
      storage: input.storage,
      fields: EntityTransform.fields.reverse(input.fields),
    };
  }
  constructor(init: IEntityProps) {
    super();
    this.store = new EntityStorage(this.transform(init));
    this.init = new (Record<IEntityProps>(init))();
  }
}
