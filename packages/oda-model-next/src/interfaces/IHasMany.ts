import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';
import { FieldTransformType, EntityRefTransform } from './types';

export interface IHasManyInit extends Partial<IRelationInit> {
  hasMany: string | IEntityRef;
}

export interface IHasManyStore extends IRelationStore {
  hasMany: IEntityRef;
}

export interface IRelationTransform {
  hasMany: EntityRefTransform;
  fields: FieldTransformType;
}

export interface IHasMany extends IRelation {
  readonly verb: 'HasMany';
  readonly hasMany: IEntityRef;
}
