import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';
import { IUpdatable } from '../model/Persistent';

export type IBelongsToRelationProps  = IRelationProps &  {
  belongsTo: IEntityRef;
};

export type IBelongsToRelationPropsStore = IRelationPropsStore & {
  belongsTo: IEntityRef;
};

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
