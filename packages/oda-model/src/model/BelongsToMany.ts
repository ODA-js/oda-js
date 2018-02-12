import { Map, Record } from 'immutable';

import { IBelongsToMany, IBelongsToManyInit, IBelongsToManyStore } from '../interfaces/IBelongsToMany';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { EntityRef } from './EntityRef';
import { Field } from './Field';
import { Relation } from './Relation';


// tslint:disable-next-line:variable-name
export const DefaultBelongsToMany: IBelongsToManyStore = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  belongsToMany: null,
  using: null,
  //storage
  single: false,
  stored: false,
  embedded: false,
  // name
  fullName: null,
  normalName: null,
  shortName: null,
};

// tslint:disable-next-line:variable-name
export const BelongsToManyTransform = {
  belongsToMany: {
    transform: (inp) => {
      if (inp) {
        return new EntityRef(inp);
      } else {
        return null;
      }
    },
    reverse: (inp) => {
      if (inp) {
        return inp.toString();
      } else {
        return null;
      }
    },
  },
  fields: {
    transform: (input: IFieldInit[]) => {
      if (input) {
        return Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]);
      } else {
        return null;
      }
    },
    reverse: (input: Map<string, IField>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS());
      } else {
        return null;
      }
    },
  },
  using: {
    transform: (inp) => {
      if (inp) {
        return new EntityRef(inp);
      } else {
        return null;
      }
    },
    reverse: (inp) => {
      if (inp) {
        return inp.toString();
      } else {
        return null;
      }
    },
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
          if (f === 'belongsToMany') {
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

  protected reverse(input: Record<IBelongsToManyStore> & Readonly<IBelongsToManyStore>): Partial<IBelongsToManyInit> {
    const result: IBelongsToManyInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'belongsToMany' || f === 'ref') {
            result.belongsToMany = BelongsToManyTransform.belongsToMany.reverse(input.belongsToMany);
          } else if (f === 'using') {
            result.using = BelongsToManyTransform.using.reverse(input.using);
          } else if (f === 'fields') {
            result.fields = BelongsToManyTransform.fields.reverse(input.fields);
          } else {
            result[f] = core[f];
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
