import { IUpdatable } from './IUpdatable';
import { IValidate } from './IValidate';
import { MetaModelType } from './types';

export interface INamedItem {
  name: string;
  title?: string;
  description?: string;
}

export interface IModelType
  extends Readonly<INamedItem>,
    IValidate,
    IUpdatable {
  readonly name: string;
  readonly title?: string;
  readonly description?: string;
  readonly modelType: MetaModelType;
}
