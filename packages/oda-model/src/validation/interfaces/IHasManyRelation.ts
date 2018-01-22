import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps } from './IRelation';

export type IHasManyRelationProps  = IRelationProps & {
  hasMany: IEntityRef;
};

export interface IHasManyRelation extends IRelation<IHasManyRelationProps> {}
