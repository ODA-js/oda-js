import { INamedItem, IModelType } from './IModelType';

export interface IFieldArgInit extends INamedItem {
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldArg extends IModelType, Readonly<IFieldArgInit> {
  readonly type?: string;
  readonly required?: boolean;
  readonly defaultValue?: string;
}

export type FieldArgsInput = {
  [name: string]: Partial<IFieldArgInit>,
} | IFieldArgInit[];
