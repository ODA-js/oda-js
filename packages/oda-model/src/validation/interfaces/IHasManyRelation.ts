import { IEntityRef } from './IEntityRef';
import { IRelation } from './IRelation';

export interface IHasManyRelation extends IRelation {
  hasMany: IEntityRef;
}
