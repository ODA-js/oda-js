import { IModel } from '../interfaces/IModel';
import { RestartType } from '../interfaces/types';
import { error } from 'util';
import { IValidationResult } from '../interfaces/IValidationResult';
import { IValidationContext } from './IValidationContext';
import { IContext } from './IContext';

export interface IModelContext extends IContext {
  readonly model: IModel;
}
