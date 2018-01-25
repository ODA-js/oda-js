import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';

export type IHasManyRelationProps  = IRelationProps & {
  hasMany: IEntityRef;
};

export type IHasManyRelationPropsStore  = IRelationPropsStore & {
  verb: 'HasMany',
  hasMany: IEntityRef;
};

export interface IHasManyRelation extends IRelation<IHasManyRelationProps, IHasManyRelationPropsStore> {}
