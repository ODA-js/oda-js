import {Relation} from './Relation';
import { IRelationStore } from '../interfaces/IRelation';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IBelongsToStore,
  IBelongsToInit,
  IBelongsTo,
  IRelationTransform,
} from '../interfaces/IBelongsTo';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField } from '../interfaces/IField';
import { EntityRef } from './EntityRef';

// tslint:disable-next-line:variable-name
export const DefaultBelongsTo: IBelongsToStore = {
  name: null,
  title: null,
  description: null,
  fields: null,
  opposite: null,
  belongsTo: null,
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
export const BelongsToTransform: IRelationTransform = {
  belongsTo: {
    transform: (inp) => new EntityRef(inp),
    reverse: (inp) => inp.toString(),
  },
  fields: transformMap<IField>(),
};

// tslint:disable-next-line:variable-name
export const BelongsToStorage = Record(DefaultBelongsTo);

export class BelongsTo extends Relation<IBelongsToInit, IBelongsToStore> implements IBelongsTo {
  public get verb(): 'BelongsTo' {
    return 'BelongsTo';
  }
  public get ref(): IEntityRef {
    return this.store.get('belongsTo', null);
  }
  public get belongsTo(): IEntityRef {
    return this.store.get('belongsTo', null);
  }

  protected transform(input: IBelongsToInit): IBelongsToStore {
    return input && {
      belongsTo: BelongsToTransform.belongsTo.transform(input.belongsTo),
      single: true,
      stored: true,
      embedded: true,
      fields: input.fields && BelongsToTransform.fields.transform(input.fields),
      description: input.description,
      fullName: input.fullName,
      name: input.name,
      normalName: input.normalName,
      opposite: input.opposite,
      shortName: input.shortName,
      title: input.title,
    };
  }
  protected reverse(input: IBelongsToStore): IBelongsToInit {
    return input && {
      name: input.name,
      title: input.title,
      description: input.description,
      fullName: input.fullName,
      normalName: input.normalName,
      shortName: input.shortName,
      opposite: input.opposite,
      belongsTo: input.belongsTo,
      fields: input.fields && BelongsToTransform.fields.reverse(input.fields),
      single: true,
      stored: true,
      embedded: true,
    };
  }
  constructor(init: IBelongsToInit) {
    super();
    this.store = new BelongsToStorage(this.transform(init));
    this.init = new (Record<IBelongsToInit>(init))();
  }
}
