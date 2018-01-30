import { IModelType, INamedItem } from './IModelType';
import { ValidationContext } from './types';

export interface IVisitor<M extends IModelType, C extends ValidationContext> {
  readonly context: C;
  visit(item: M);
}
