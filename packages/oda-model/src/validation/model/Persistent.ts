import { Record } from 'immutable';

import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidator } from '../interfaces/IValidator';

export abstract class Persistent<TInputProps, TStoredProps> {
  protected store: Record<TStoredProps>;
  protected init: Record<TInputProps>;
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
}