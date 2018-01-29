import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';
import { IField } from './IField';

export interface IBelongsToRelationProps extends IRelationProps {
  belongsTo: IEntityRef;
}

export interface IBelongsToRelationPropsStore extends IRelationPropsStore {
  belongsTo: IEntityRef;
}

export interface IRelationTransform {
  fields: ArrayToMap<IField>;
}

export interface IBelongsToRelation extends IRelation,
  IUpdatable<IBelongsToRelationProps>, IBelongsToRelationPropsStore {
  readonly verb: 'BelongsTo';
}

export function IsBelongsToProps(item: IRelationProps): item is IBelongsToRelationProps {
  return !!(<IBelongsToRelationProps>item).belongsTo;
}
