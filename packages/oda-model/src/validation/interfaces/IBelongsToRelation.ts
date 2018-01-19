import { IEntityRef } from './IEntityRef';
import { IRelation } from './IRelation';

export interface IBelongsToRelation extends IRelation {
  belongsTo: IEntityRef;
}
