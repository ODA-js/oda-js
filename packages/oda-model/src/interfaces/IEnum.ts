import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';

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
  values: MapType< EnumInitItem[] | {
    [name: string]: EnumInitItem;
  }
  , Map<string, IEnumItem>>;
}

export interface IEnum extends IModelType, IPackagedItem {
  readonly modelType: 'enum';
  readonly values: Map<string, IEnumItem>;
}

