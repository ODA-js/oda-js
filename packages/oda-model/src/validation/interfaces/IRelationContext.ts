import { IFieldContext } from './IFieldContext';
import { RelationUnion, RestartType } from './types';

export interface IRelationContext extends IFieldContext {
  readonly relation: RelationUnion;
  restart(level: RestartType);
}
