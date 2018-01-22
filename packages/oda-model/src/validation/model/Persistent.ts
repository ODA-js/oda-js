import { Record } from 'immutable';

import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidator } from '../interfaces/IValidator';

export class Persistent<TProps> {
  protected store: Record<TProps>;
  protected init: Record<TProps>;
  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }
  public updateWith(obj: Partial<TProps>) {
    this.store = this.store.mergeDeep(obj);
  }
}
