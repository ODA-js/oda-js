import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import { INamedItem, IModelType } from './IModelType';
import { IPackagedItem, IPackagedItemStore, IPackagedItemInit } from './IPackagedItem';
import { IPackage } from './IPackage';

export type EnumInitItem = IEnumItemInit | string;

export interface IEnumInit extends Partial<INamedItem>, Partial<IPackagedItemInit> {
  values: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  };
}

export interface IEnumStore extends INamedItem, IPackagedItemStore {
  values: Map<string, IEnumItem>;
}

export interface IEnumItemInit extends Partial<INamedItem> {
  enum?: IEnum;
  value?: string;
  type?: string;
}

export interface IEnumItem extends IModelType {
  enum?: IEnum;
  value?: string;
  type?: string;
}

export interface IEnumTransform {
  values: ArrayToMap<IEnumItem>;
}

export interface IEnum extends IModelType, IPackagedItem {
  readonly modelType: 'enum';
  readonly values: Map<string, IEnumItem>;
}

