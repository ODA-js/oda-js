import { ArrayToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IBelongsToInit extends IRelationInit {
  belongsTo: string | IEntityRef;
}

export interface IBelongsToStore extends IRelationStore {
  belongsTo: IEntityRef;
}

export interface IRelationTransform {
  belongsTo: MapType<string | IEntityRef, IEntityRef>;
  fields: ArrayToMap<IField>;
}

export interface IBelongsTo extends IRelation {
  readonly verb: 'BelongsTo';
  readonly belongsTo: IEntityRef;
}

