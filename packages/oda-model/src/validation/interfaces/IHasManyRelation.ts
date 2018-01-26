import { IEntityRef } from './IEntityRef';
import { IRelationProps, IRelationPropsStore, IRelation } from './IRelation';
import { IModelType } from './IModelType';
import { IUpdatable } from '../model/Persistent';

export interface IHasManyRelationProps extends IRelationProps  {
  hasMany: IEntityRef;
}

export interface IHasManyRelationPropsStore extends IRelationPropsStore  {
  hasMany: IEntityRef;
}

export type IRelationTransform = {
  [k in keyof IHasManyRelationProps]?: {
    transform: (input: IHasManyRelationProps[k]) => IHasManyRelationPropsStore[k];
    reverse: (input: IHasManyRelationPropsStore[k]) => IHasManyRelationProps[k];
  }
};

export interface IHasManyRelation extends IRelation<IHasManyRelationProps, IHasManyRelationPropsStore>
  , IUpdatable<IHasManyRelationProps> {
  readonly verb: 'HasMany';
}
