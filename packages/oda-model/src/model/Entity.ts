import { Map, Record, Set } from 'immutable';

import { IEntity, IEntityInit, IEntityStore, IEntityTransform, IEntityACL} from '../interfaces/IEntity';
import { IField } from '../interfaces/IField';
import { IPackage } from '../interfaces/IPackage';
import { Persistent } from './Persistent';
import { TransformField } from './utils';
import { IPackageContext } from '../contexts/IPackageContext';
import { IEntityContext } from '../contexts/IEntityContext';

// tslint:disable-next-line:variable-name
export const DefaultEntity: IEntityStore = {
  name: null,
  title: null,
  description: null,
  acl: null,
  plural: null,
  singular: null,
  fields: null,
  storage: null,
  indexed: null,
  relations: null,
  required: null,
};

// tslint:disable-next-line:variable-name
export const EntityTransform: IEntityTransform = {
  fields: TransformField(),
};

// tslint:disable-next-line:variable-name
export const EntityStorage = Record(DefaultEntity);

export class Entity extends Persistent<IEntityInit, IEntityStore, IPackageContext> implements IEntity {
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
  protected transform(input: Partial<IEntityInit>): IEntityStore {
    const result: IEntityStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'fields') {
            result.fields = EntityTransform.fields.transform(input.fields, this);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Record<IEntityStore> & Readonly<IEntityStore>): IEntityInit {
    const result: IEntityInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'fields') {
            result.fields = EntityTransform.fields.reverse(input.fields);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init?: Partial<IEntityInit>, context?: IPackageContext) {
    super();
    if (!context && init && init.fields) {
      throw new Error('context must be provided');
    }
    if (context) {
      this.attach(context);
    }
    this.store = new EntityStorage(this.transform(init));
  }
}
