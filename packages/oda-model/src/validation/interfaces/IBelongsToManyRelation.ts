import { IEntityRef } from './IEntityRef';
import { IRelation, IRelationProps, IRelationPropsStore } from './IRelation';
import { IUpdatable } from '../model/Persistent';

export type IBelongsToManyRelationProps = IRelationProps & {
  belongsToMany: IEntityRef;
  using?: IEntityRef;
};

export type IBelongsToManyRelationPropsStore = IRelationPropsStore & {
  belongsToMany: IEntityRef;
  using?: IEntityRef;
};

export type IRelationTransform = {
  [k in keyof IBelongsToManyRelationProps]?: {
    transform: (input: IBelongsToManyRelationProps[k]) => IBelongsToManyRelationPropsStore[k];
    reverse: (input: IBelongsToManyRelationPropsStore[k]) => IBelongsToManyRelationProps[k];
  }
};

export interface IBelongsToManyRelation
extends IRelation<IBelongsToManyRelationProps, IBelongsToManyRelationPropsStore>,
  IUpdatable<IBelongsToManyRelationProps> {
  verb: 'BelongsToMany';
}
