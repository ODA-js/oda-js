import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps } from './IRelation';

export type IBelongsToManyRelationProps = IRelationProps & {
  belongsToMany: IEntityRef;
};

export interface IBelongsToManyRelation extends IRelation<IBelongsToManyRelationProps> {}
