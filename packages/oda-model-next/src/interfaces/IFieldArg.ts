import { IContextable } from '../contexts/IContextable';
import { IFieldContext } from '../contexts/IFieldContext';
import { IMutationContext } from '../contexts/IMutationContext';
import { IModelType, INamedItem } from './IModelType';

export interface IFieldArgInit extends INamedItem {
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldArgStore extends INamedItem {
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldArg extends IModelType, Readonly<IFieldArgInit>, IContextable<IMutationContext | IFieldContext> {
  readonly type?: string;
  readonly required?: boolean;
  readonly defaultValue?: string;
}

export type FieldArgsInput = {
  [name: string]: Partial<IFieldArgInit>,
} | IFieldArgInit[];
