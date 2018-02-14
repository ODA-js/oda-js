import { Map } from 'immutable';

import { MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField, IFieldInit } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { FieldTransformType } from './types';

export interface IHasOneInit extends Partial<IRelationInit> {
  hasOne: string | IEntityRef;
}

export interface IHasOneStore extends IRelationStore {
  hasOne: IEntityRef;
}

export interface IRelationTransform {
  hasOne: MapType<string | IEntityRef, IEntityRef>;
  fields: FieldTransformType;
}

export interface IHasOne extends IRelation {
  readonly verb: 'HasOne';
  readonly hasOne: IEntityRef;
}
