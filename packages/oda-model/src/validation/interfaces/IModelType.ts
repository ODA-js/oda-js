
import { IValidate } from './IValidate';
import { MetaModelType } from './types';

export interface IModelTypeProps {
  name: string;
  title?: string;
  description?: string;
}

export interface IModelType extends IValidate, IModelTypeProps {
  readonly modelType: MetaModelType;
}
