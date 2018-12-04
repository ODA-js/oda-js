import { IContext } from './IContext';

export interface IContextable<T extends IContext> {
  context: T;
  attach(ctx: T);
}
