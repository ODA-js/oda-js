import { IModel } from './IModel';
import { RestartType } from './types';
import { error } from 'util';
import { IValidationResult } from './IValidationResult';

export interface IModelContext {
  readonly model: IModel;
  readonly errors: IValidationResult[];
  readonly isValid: boolean;
  restart(level: RestartType);
}
