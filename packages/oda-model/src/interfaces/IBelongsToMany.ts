import { Map } from 'immutable';

import { MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField, IFieldInit } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { FieldTransformType } from './types';

export interface IBelongsToManyInit extends Partial<IRelationInit> {
  belongsToMany: string | IEntityRef;
  using: string | IEntityRef;
}

export interface IBelongsToManyStore extends IRelationStore {
  belongsToMany: IEntityRef;
  using: IEntityRef;
}

export interface IRelationTransform {
  belongsToMany: MapType<string | IEntityRef, IEntityRef>;
  using: MapType<string | IEntityRef, IEntityRef>;
  fields: FieldTransformType;
}

export interface IBelongsToMany extends IRelation {
  readonly verb: 'BelongsToMany';
  readonly belongsToMany: IEntityRef;
  readonly using: IEntityRef;
}

