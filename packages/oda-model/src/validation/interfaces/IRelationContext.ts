import { IFieldContext } from './IFieldContext';
import { IRelation } from './IRelation';
import { RestartType } from './types';

export interface IRelationContext extends IFieldContext {
  relation: IRelation;
  restart(level: RestartType);
}
