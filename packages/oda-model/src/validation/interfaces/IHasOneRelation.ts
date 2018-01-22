import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps } from './IRelation';

export type IHasOneRelationProps = IRelationProps & {
  hasOne: IEntityRef;
};

export interface IHasOneRelation extends IRelation<IHasOneRelationProps> {}
