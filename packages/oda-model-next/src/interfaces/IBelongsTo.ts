import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { EntityRefTransform, FieldTransformType } from './types';

export interface IBelongsToInit extends Partial<IRelationInit> {
  belongsTo: string | IEntityRef;
}

export interface IBelongsToStore extends IRelationStore {
  belongsTo: IEntityRef;
}

export interface IRelationTransform {
  belongsTo: EntityRefTransform;
  fields: FieldTransformType;
}

export interface IBelongsTo extends IRelation {
  readonly verb: 'BelongsTo';
  readonly belongsTo: IEntityRef;
}

