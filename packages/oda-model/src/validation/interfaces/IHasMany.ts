import { ArrayToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IHasManyInit extends IRelationInit {
  hasMany: string | IEntityRef;
}

export interface IHasManyStore extends IRelationStore {
  hasMany: IEntityRef;
}

export interface IRelationTransform {
  hasMany: MapType<string | IEntityRef, IEntityRef>;
  fields: ArrayToMap<IField>;
}

export interface IHasMany extends IRelation {
  readonly verb: 'HasMany';
  readonly hasMany: IEntityRef;
}

export function IsHasManyProps(item: IRelationInit): item is IHasManyInit {
  return !!(<IHasManyInit>item).hasMany;
}
