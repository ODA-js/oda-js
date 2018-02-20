import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { EnumInitItem, IEnumItem, IEnumItemInit } from './IEnumItem';
import { IPackageContext } from '../contexts/IPackageContext';

export interface IEnumInit extends INamedItem, IPackagedItemInit {
  values: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  };
  context: IPackageContext;
}

export interface IEnumStore extends INamedItem, IPackagedItemStore {
  values: Map<string, IEnumItem>;
  context: IPackageContext;
}

export interface IEnumTransform {
  values: EnumItemTransformType;
}

export interface IEnum extends IModelType, IPackagedItem {
  readonly modelType: 'enum';
  readonly values: Map<string, IEnumItem>;
  readonly context: IPackageContext;
}

export type EnumItemTransformType = {
  transform: (input: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  }) => Map<string, IEnumItem>;
  reverse: (input: Map<string, IEnumItem>) => IEnumItemInit[];
};
