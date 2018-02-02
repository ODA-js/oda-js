import { IFieldContext } from './IFieldContext';
import { IRelation } from '../interfaces/IRelation';
import { RestartType } from '../interfaces/types';

export interface IRelationContext extends IFieldContext {
  readonly relation: IRelation;
  restart(level: RestartType);
}
