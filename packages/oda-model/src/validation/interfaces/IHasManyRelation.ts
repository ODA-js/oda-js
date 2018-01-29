import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';
import { IField } from './IField';

export interface IHasManyRelationProps extends IRelationProps  {
  hasMany: IEntityRef;
}

export interface IHasManyRelationPropsStore extends IRelationPropsStore  {
  hasMany: IEntityRef;
}

export interface IRelationTransform {
  fields: ArrayToMap<IField>;
}

export interface IHasManyRelation extends IRelation
  , IUpdatable<IHasManyRelationProps>, IHasManyRelationPropsStore {
  readonly verb: 'HasMany';
}

export function IsHasManyProps(item: IRelationProps): item is IHasManyRelationProps {
  return !!(<IHasManyRelationProps>item).hasMany;
}
