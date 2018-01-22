import { IModel } from './IModel';
import { RestartType } from './types';

export interface IModelContext {
  readonly model: IModel;
  restart(level: RestartType);
}
