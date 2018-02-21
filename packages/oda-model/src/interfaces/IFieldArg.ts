import { INamedItem, IModelType } from './IModelType';
import { IMutationContext } from '../contexts/IMutationContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { IContextable } from '../contexts/IContextable';

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
