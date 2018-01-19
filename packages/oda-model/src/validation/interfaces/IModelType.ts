
import { IValidate } from './IValidate';
import { MetaModelType } from './types';

export interface IModelType extends IValidate {
  modelType: MetaModelType;
  name: string;
  title: string;
  description: string;
}
