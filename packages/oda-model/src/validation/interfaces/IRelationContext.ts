import { IFieldContext } from './IFieldContext';
import { IRelation } from './IRelation';
import { RestartType, RelationProps } from './types';

export interface IRelationContext extends IFieldContext {
  readonly relation: IRelation<RelationProps>;
  restart(level: RestartType);
}
