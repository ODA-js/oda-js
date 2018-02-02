import { IValidator } from './IValidator';
import { IValidationResult } from './IValidationResult';

export interface IValidate {
  validate(validator: IValidator): IValidationResult[];
}
