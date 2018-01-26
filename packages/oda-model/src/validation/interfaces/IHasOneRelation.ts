import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';
import { IUpdatable } from '../model/Persistent';

export interface IHasOneRelationProps extends IRelationProps {
  hasOne: IEntityRef;
}

export interface IHasOneRelationPropsStore extends IRelationPropsStore  {
  hasOne: IEntityRef;
}

export type IRelationTransform = {
  [k in keyof IHasOneRelationProps]?: {
    transform: (input: IHasOneRelationProps[k]) => IHasOneRelationPropsStore[k];
    reverse: (input: IHasOneRelationPropsStore[k]) => IHasOneRelationProps[k];
  }
};

export interface IHasOneRelation extends IRelation<IHasOneRelationProps, IHasOneRelationPropsStore>,
  IUpdatable<IHasOneRelationProps> {
  verb: 'HasOne';
}
