import { Record } from 'immutable';

import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidator } from '../interfaces/IValidator';

export interface IUpdatable<T> {
  updateWith(obj: Partial<T>);
}

export abstract class Persistent<TInputProps, TStoredProps> implements IUpdatable<TInputProps> {
  protected store: Record<TStoredProps>;
  protected init: TInputProps;
  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }
  protected transform(input: Partial<TInputProps>): Partial<TStoredProps> {
    throw new Error('not implemented');
  }
  protected reverse(input: Partial<TStoredProps>): Partial<TInputProps> {
    throw new Error('not implemented');
  }
  public updateWith(obj: Partial<TInputProps>) {
    this.store = this.store.mergeDeep(this.transform(obj));
  }
  public toJS() {
    return this.reverse(this.store.toJS());
  }
  public clone() {
    const t = this.constructor() as Persistent<TInputProps, TStoredProps>;
    t.store = this.store;
    t.init = this.init;
  }
}
