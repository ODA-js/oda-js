import { IContextable } from '../contexts/IContextable';
import { IEnumContext } from '../contexts/IEnumContext';
import { IModelType, INamedItem } from './IModelType';

export type EnumInitItem = IEnumItemInit | string;

export interface IEnumItemInit extends INamedItem {
  value?: string;
  type?: string;
}

export interface IEnumItemStore extends INamedItem {
  value: string;
  type: string;
}

export interface IEnumItem extends IModelType, Readonly<IEnumItemInit>, IContextable<IEnumContext> {
  readonly value: string;
  readonly type: string;
}
