import { IModel } from '../interfaces/IModel';
import { Record, Seq } from 'immutable';
import { Map, Set } from 'immutable';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IEntityStore,
  IEntity,
  IEntityInit,
  IEntityTransform,
  IEntityACL,
} from '../interfaces/IEntity';
import { IField, IFieldInit } from '../interfaces/IField';
import { IPackage } from '../interfaces/IPackage';
import { Field } from './Field';
import { Package } from './Package';


// tslint:disable-next-line:variable-name
export const DefaultEntity: IEntityStore = {
  package: null,
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
  fields: {
    transform: (input: {
      [name: string]: Partial<IFieldInit>,
    } | Partial<IFieldInit>[]) => {
      if (!Array.isArray(input)) {
        input = Object.keys(input).map(k => ({
          name: k,
          ...input[k],
        }));
      }
      debugger;
      return Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]);
    },

    reverse: (input:  Map<string, IField>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS());
      } else {
        return null;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const EntityStorage = Record(DefaultEntity);

export class Entity extends Persistent<IEntityInit, IEntityStore> implements IEntity {
  public get package(): IPackage {
    return this.store.get('package', null);
  }
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
            result.fields = EntityTransform.fields.transform(input.fields);
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

  constructor(init: Partial<IEntityInit> = {}) {
    super();
    this.store = new EntityStorage(this.transform(init));
    this.init = new (Record<Partial<IEntityInit>>(init))();
  }
}
