import { Record } from 'immutable';
import { IUpdatable } from '../interfaces/IUpdatable';
import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidator } from '../interfaces/IValidator';

export abstract class Persistent<TInputProps, TStoredProps> implements IUpdatable {
  protected store: Record<TStoredProps>;
  protected init: Partial<TInputProps>;

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

  public clone() {
    const t = this.constructor() as Persistent<TInputProps, TStoredProps>;
    t.store = this.store;
    t.init = this.init;
    return t;
  }
}
