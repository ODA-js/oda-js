import { INamedItem, IModelType } from './IModelType';
import { IMutationContext } from '../contexts/IMutationContext';
import { IFieldContext } from '../contexts/IFieldContext';

export interface IFieldArgInit extends INamedItem {
  type?: string;
  required?: boolean;
  defaultValue?: string;
  context: IMutationContext | IFieldContext;
}

export interface IFieldArg extends IModelType, Readonly<IFieldArgInit> {
  readonly type?: string;
  readonly required?: boolean;
  readonly defaultValue?: string;
  readonly context: IMutationContext | IFieldContext;
}

export type FieldArgsInput = {
  [name: string]: Partial<IFieldArgInit>,
} | IFieldArgInit[];
