import { Record, Map } from 'immutable';

import { IBelongsToMany, IBelongsToManyInit, IBelongsToManyStore, IRelationTransform } from '../interfaces/IBelongsToMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { EntityRef } from './EntityRef';
import { Relation } from './Relation';
import { transformMap } from './utils';
import { Field } from './Field';


// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: Partial<IBelongsToManyStore> = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
  using: null,
  //storage
  single: true,
  stored: true,
  embedded: true,
  // name
  fullName: null,
  normalName: null,
  shortName: null,
};

// tslint:disable-next-line:variable-name
export const BelongsToManyTransform: IRelationTransform = {
  belongsToMany: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  using: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: {
    transform: (input: IFieldInit[]) => Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]),
    reverse: (input: Map<string, IField>) => Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS()),
  },
};

// tslint:disable-next-line:variable-name
export const BelongsToManyStorage = Record(DefaultBelongsToMany);

export class BelongsToMany
  extends Relation<IBelongsToManyInit, IBelongsToManyStore> implements IBelongsToMany {
  public get verb(): 'BelongsToMany' {
    return 'BelongsToMany';
  }
  public get ref(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get belongsToMany(): IEntityRef {
    return this.store.get('belongsToMany', null);
  }
  public get using(): IEntityRef {
    return this.store.get('using', null);
  }

  protected transform(input: Partial<IBelongsToManyInit>): Partial<IBelongsToManyStore> {
    const result: IBelongsToManyStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.belongsToMany = BelongsToManyTransform.belongsToMany.transform(input.belongsToMany);
          } else if (f === 'using') {
            result.using = BelongsToManyTransform.using.transform(input.using);
          } else if (f === 'fields') {
            result.fields = BelongsToManyTransform.fields.transform(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Partial<IBelongsToManyStore>): Partial<IBelongsToManyInit> {
    const result: IBelongsToManyInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'belongsTo') {
            result.belongsToMany = BelongsToManyTransform.belongsToMany.reverse(input.belongsToMany);
          } else if (f === 'using') {
            result.using = BelongsToManyTransform.using.reverse(input.using);
          } else if (f === 'fields') {
            result.fields = BelongsToManyTransform.fields.reverse(input.fields);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IBelongsToManyInit> = {}) {
    super();
    this.store = new BelongsToManyStorage(this.transform(init));
    this.init = new (Record<Partial<IBelongsToManyInit>>(init))();
  }
}