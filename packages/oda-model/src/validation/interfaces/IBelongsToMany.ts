import { ArrayToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IBelongsToManyInit extends IRelationInit {
  belongsToMany: string | IEntityRef;
  using: string | IEntityRef;
}

export interface IBelongsToManyStore extends IRelationStore {
  belongsToMany: IEntityRef;
  using: IEntityRef;
}

export interface IRelationTransform {
  belongsToMany: MapType<string | IEntityRef, IEntityRef>;
  fields: ArrayToMap<IField>;
}

export interface IBelongsToMany extends IRelation {
  readonly verb: 'BelongsToMany';
  readonly belongsToMany: IEntityRef;
  readonly using: IEntityRef;
}

export function IsBelongsToManyProps(item: IRelationInit): item is IBelongsToManyInit {
  return !!(<IBelongsToManyInit>item).belongsToMany;
}
