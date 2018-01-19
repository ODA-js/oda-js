import { IModel } from './IModel';
import { RestartType } from './types';

export interface IModelContext {
  model: IModel;
  restart(level: RestartType);
}
