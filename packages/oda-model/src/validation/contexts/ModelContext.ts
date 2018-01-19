import { IModel } from '../interfaces/IModel';
import { IModelContext } from '../interfaces/IModelContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';

export class ModelContext implements IModelContext {
  public model: IModel;
  public errors: IValidationResult[];
  constructor(model: IModel) {
    this.model = model;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model);
  }

  public restart(level: RestartType) {
    restart('model');
  }
}
