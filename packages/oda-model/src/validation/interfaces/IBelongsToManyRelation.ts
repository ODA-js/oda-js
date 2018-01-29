import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';
import { IField } from './IField';

export interface IBelongsToManyRelationProps extends IRelationProps {
  belongsToMany: IEntityRef;
  using: IEntityRef;
}

export interface IBelongsToManyRelationPropsStore extends IRelationPropsStore {
  belongsToMany: IEntityRef;
  using: IEntityRef;
}

export interface IRelationTransform {
  fields: ArrayToMap<IField>;
}

export interface IBelongsToManyRelation
  extends IRelation,
  IUpdatable<IBelongsToManyRelationProps>, IBelongsToManyRelationPropsStore {
  readonly verb: 'BelongsToMany';
}

export function IsBelongsToManyProps(item: IRelationProps): item is IBelongsToManyRelationProps {
  return !!(<IBelongsToManyRelationProps>item).belongsToMany;
}
