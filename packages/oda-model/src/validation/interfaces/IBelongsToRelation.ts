import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps } from './IRelation';

export type IBelongsToRelationProps  = IRelationProps &  {
  belongsTo: IEntityRef;
};

export interface IBelongsToRelation extends IRelation<IBelongsToRelationProps> {}
