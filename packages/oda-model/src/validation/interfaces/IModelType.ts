
import { IValidate } from './IValidate';
import { MetaModelType } from './types';

export type IModelTypeProps = {
  name: string;
  title?: string;
  description?: string;
};

export type IModelType< T extends Partial<IModelTypeProps>, TS extends Partial<IModelTypeProps>> = IValidate & Readonly<TS> & {
  readonly modelType: MetaModelType;
  updateWith(update: Partial<T>);
};
