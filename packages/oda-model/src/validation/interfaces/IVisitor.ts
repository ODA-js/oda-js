import { IModelType, IModelTypeProps } from './IModelType';
import { ValidationContext } from './types';

export interface IVisitor<T extends IModelTypeProps, TS extends IModelTypeProps, M extends IModelType<T, TS>, C extends ValidationContext> {
  readonly context: C;
  visit(item: M);
}
