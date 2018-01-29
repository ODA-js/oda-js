import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';
import { IField } from './IField';

export interface IHasOneRelationProps extends IRelationProps {
  hasOne: IEntityRef;
}

export interface IHasOneRelationPropsStore extends IRelationPropsStore  {
  hasOne: IEntityRef;
}

export interface IRelationTransform {
  fields: ArrayToMap<IField>;
}

export interface IHasOneRelation extends IRelation,
  IUpdatable<IHasOneRelationProps>, IHasOneRelationPropsStore {
  readonly verb: 'HasOne';
}

export function IsHasOneProps(item: IRelationProps): item is IHasOneRelationProps {
  return !!(<IHasOneRelationProps>item).hasOne;
}
