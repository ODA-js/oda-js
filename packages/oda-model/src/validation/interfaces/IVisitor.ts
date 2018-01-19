import { IModelType } from './IModelType';
import { ValidationContext } from './types';

export interface IVisitor<T extends IModelType, C extends ValidationContext> {
  context: C;
  visit(item: T);
}
