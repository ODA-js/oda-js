
import { IValidate } from './IValidate';
import { MetaModelType } from './types';
import { IUpdatable } from './IUpdatable';

export interface INamedItem {
  name: string;
  title?: string;
  description?: string;
}

export interface IModelType extends IValidate, IUpdatable {
  readonly name: string;
  readonly title?: string;
  readonly description?: string;
  readonly modelType: MetaModelType;
}
