import { ArrayToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField, IFieldInit } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { Map} from 'immutable';
import { FieldTransformType } from './types';

export interface IBelongsToInit extends Partial<IRelationInit> {
  belongsTo: string | IEntityRef;
}

export interface IBelongsToStore extends IRelationStore {
  belongsTo: IEntityRef;
}

export interface IRelationTransform {
  belongsTo: MapType<string | IEntityRef, IEntityRef>;
  fields: FieldTransformType;
}

export interface IBelongsTo extends IRelation {
  readonly verb: 'BelongsTo';
  readonly belongsTo: IEntityRef;
}

