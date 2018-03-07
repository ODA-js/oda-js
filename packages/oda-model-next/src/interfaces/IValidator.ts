import { IValidate } from './IValidate';
import { IValidationResult } from './IValidationResult';

export interface IValidator {
  check(item: IValidate): IValidationResult[];
}
