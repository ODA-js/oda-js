import { IValidator } from './IValidator';
import { IValidationResult } from './IValidationResult';

export type IValidate  = {
  validate(validator: IValidator): IValidationResult[];
};
