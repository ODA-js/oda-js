import { Record } from 'immutable';

import { IUpdatable } from '../interfaces/IUpdatable';
import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidator } from '../interfaces/IValidator';
import { IContext } from '../contexts/IContext';
import { IContextable } from '../contexts/IContextable';

export abstract class Persistent<
  TInputProps,
  TStoredProps,
  TContext extends IContext
> implements IUpdatable, IContextable<TContext> {
  protected store: Record<TStoredProps>;
  /**
   * validate current item
   * @param validator
   */
  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }

  /**
   * from input to stored
   * @param input input type
   */
  protected transform(input?: Partial<TInputProps>): Partial<TStoredProps> {
    throw new Error('not implemented');
  }

  /**
   * from stored to input
   * @param stored
   */
  protected reverse(stored?: Record<TStoredProps>): Partial<TInputProps> {
    throw new Error('not implemented');
  }

  public updateWith<T extends TInputProps>(obj: Partial<T>) {
    this.store = this.store.mergeDeep(this.transform(obj));
  }

  public toJS(): Partial<TInputProps> {
    return this.reverse(this.store);
  }

  public get context(): TContext {
    return this._context;
  }

  private _context;

  public clone() {
    const t = this.constructor() as Persistent<
      TInputProps,
      TStoredProps,
      TContext
    >;
    t.store = this.store;
    return t;
  }

  public constructor(ctx?: TContext) {
    if (ctx) {
      this.attach(ctx);
    }
  }

  public attach(ctx: TContext) {
    this._context = ctx;
  }
}
