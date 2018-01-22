import { IFieldContext } from './IFieldContext';
import { Relation, RestartType } from './types';

export interface IRelationContext extends IFieldContext {
  readonly relation: Relation;
  restart(level: RestartType);
}
