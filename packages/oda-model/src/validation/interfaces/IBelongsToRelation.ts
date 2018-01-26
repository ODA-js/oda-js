import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';
import { IUpdatable } from '../model/Persistent';

export interface IBelongsToRelationProps extends IRelationProps {
  belongsTo: IEntityRef;
}

export interface IBelongsToRelationPropsStore extends IRelationPropsStore {
  belongsTo: IEntityRef;
}

export type IRelationTransform = {
  [k in keyof IBelongsToRelationProps]?: {
    transform: (input: IBelongsToRelationProps[k]) => IBelongsToRelationPropsStore[k];
    reverse: (input: IBelongsToRelationPropsStore[k]) => IBelongsToRelationProps[k];
  }
};

export interface IBelongsToRelation extends IRelation<IBelongsToRelationProps, IBelongsToRelationPropsStore>,
  IUpdatable<IBelongsToRelationProps> {
  readonly verb: 'BelongsTo';
}
