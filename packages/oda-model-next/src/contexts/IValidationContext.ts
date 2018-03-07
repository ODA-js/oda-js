import { IModel } from '../interfaces/IModel';
import { RestartType } from '../interfaces/types';
import { error } from 'util';
import { IValidationResult } from '../interfaces/IValidationResult';

export interface IValidationContext {
  readonly isValid: boolean;
  readonly errors: IValidationResult[];
  restart(level: RestartType);
}
