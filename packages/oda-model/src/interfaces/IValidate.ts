import { IValidationResult } from './IValidationResult';
import { IValidator } from './IValidator';

export interface IValidate {
  validate(validator: IValidator): IValidationResult[];
}
