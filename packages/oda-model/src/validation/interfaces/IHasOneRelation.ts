import { IEntityRef } from './IEntityRef';
import { IRelation } from './IRelation';

export interface IHasOneRelation extends IRelation {
  hasOne: IEntityRef;
}
