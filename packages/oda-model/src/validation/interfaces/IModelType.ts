
import { IValidate } from './IValidate';
import { MetaModelType } from './types';

export type IModelTypeProps = {
  name: string;
  title?: string;
  description?: string;
};

export type IModelType<TProps extends Partial<IModelTypeProps>> = IValidate & Readonly<TProps> & {
  readonly modelType: MetaModelType;
  updateWith(update: Partial<TProps>);
};
