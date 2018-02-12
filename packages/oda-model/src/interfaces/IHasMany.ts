import { Map } from 'immutable';

import { MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField, IFieldInit } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IHasManyInit extends Partial<IRelationInit> {
  hasMany: string | IEntityRef;
}

export interface IHasManyStore extends IRelationStore {
  hasMany: IEntityRef;
}

export interface IRelationTransform {
  hasMany: MapType<string | IEntityRef, IEntityRef>;
  fields: MapType<Partial<IFieldInit>[], Map<string, IField>>;
}

export interface IHasMany extends IRelation {
  readonly verb: 'HasMany';
  readonly hasMany: IEntityRef;
}

