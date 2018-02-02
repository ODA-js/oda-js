import { IModel } from '../interfaces/IModel';
import { RestartType } from '../interfaces/types';
import { error } from 'util';
import { IValidationResult } from '../interfaces/IValidationResult';

export interface IModelContext {
  readonly model: IModel;
  readonly errors: IValidationResult[];
  readonly isValid: boolean;
  restart(level: RestartType);
}
