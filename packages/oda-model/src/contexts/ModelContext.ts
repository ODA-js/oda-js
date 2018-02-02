import { IModel } from '../interfaces/IModel';
import { IModelContext } from './IModelContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isModel } from '../helpers';

export class ModelContext implements IModelContext {
  public model: IModel;
  public errors: IValidationResult[];
  constructor(model: IModel) {
    this.model = isModel(model) && model;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model && Array.isArray(this.errors));
  }
  public restart(level: RestartType) {
    restart('model');
  }
}
