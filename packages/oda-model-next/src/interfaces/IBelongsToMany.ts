import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { FieldTransformType, EntityRefTransform } from './types';

export interface IBelongsToManyInit extends Partial<IRelationInit> {
  belongsToMany: string | IEntityRef;
  using: string | IEntityRef;
}

export interface IBelongsToManyStore extends IRelationStore {
  belongsToMany: IEntityRef;
  using: IEntityRef;
}

export interface IRelationTransform {
  belongsToMany: EntityRefTransform;
  using: EntityRefTransform;
  fields: FieldTransformType;
}

export interface IBelongsToMany extends IRelation {
  readonly verb: 'BelongsToMany';
  readonly belongsToMany: IEntityRef;
  readonly using: IEntityRef;
}
