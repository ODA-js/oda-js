import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';

export type IHasOneRelationProps = IRelationProps & {
  hasOne: IEntityRef;
};

export type IHasOneRelationPropsStore = IRelationPropsStore & {
  hasOne: IEntityRef;
};

export interface IHasOneRelation extends IRelation<IHasOneRelationProps, IHasOneRelationPropsStore> { }
