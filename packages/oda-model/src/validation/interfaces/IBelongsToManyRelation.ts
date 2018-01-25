import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';

export type IBelongsToManyRelationProps = IRelationProps & {
  belongsToMany: IEntityRef;
  using?: IEntityRef;
};

export type IBelongsToManyRelationPropsStore = IRelationPropsStore & {
  verb: 'BelongsToMany',
  belongsToMany: IEntityRef;
  using?: IEntityRef;
};

export interface IBelongsToManyRelation extends IRelation<IBelongsToManyRelationProps, IBelongsToManyRelationPropsStore> {}
