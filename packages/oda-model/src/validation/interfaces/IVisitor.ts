import { IModelType, IModelTypeProps } from './IModelType';
import { ValidationContext } from './types';

export interface IVisitor<TProps extends IModelTypeProps, T extends IModelType<TProps>, C extends ValidationContext> {
  readonly context: C;
  visit(item: T);
}
