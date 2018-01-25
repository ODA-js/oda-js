import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';
import { IUpdatable } from '../model/Persistent';

export type IHasOneRelationProps = IRelationProps & {
  hasOne: IEntityRef;
};

export type IHasOneRelationPropsStore = IRelationPropsStore & {
  hasOne: IEntityRef;
};

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
