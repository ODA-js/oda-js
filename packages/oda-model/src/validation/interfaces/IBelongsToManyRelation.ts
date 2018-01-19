import { IEntityRef } from './IEntityRef';
import { IRelation } from './IRelation';

export interface IBelongsToManyRelation extends IRelation {
  belongsToMany: IEntityRef;
}
