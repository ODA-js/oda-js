import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';

export type IBelongsToRelationProps  = IRelationProps &  {
  belongsTo: IEntityRef;
};

export type IBelongsToRelationPropsStore = IRelationPropsStore & {
  verb: 'BelongsTo',
  belongsTo: IEntityRef;
};

export interface IBelongsToRelation extends IRelation<IBelongsToRelationProps, IBelongsToRelationPropsStore> {}
