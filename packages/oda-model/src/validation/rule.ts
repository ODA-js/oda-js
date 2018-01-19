import { ValidationContext } from './interfaces/types';
import { IValidationResult } from './interfaces/IValidationResult';

export interface Rule<T extends ValidationContext> {
  name: string;
  description: string;
  validate(context: T): IValidationResult[];
}
