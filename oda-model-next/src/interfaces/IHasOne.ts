import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { FieldTransformType, EntityRefTransform } from './types';

export interface IHasOneInit extends Partial<IRelationInit> {
  hasOne: string | IEntityRef;
}

export interface IHasOneStore extends IRelationStore {
  hasOne: IEntityRef;
}

export interface IRelationTransform {
  hasOne: EntityRefTransform;
  fields: FieldTransformType;
}

export interface IHasOne extends IRelation {
  readonly verb: 'HasOne';
  readonly hasOne: IEntityRef;
}
