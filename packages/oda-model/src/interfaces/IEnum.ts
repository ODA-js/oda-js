import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { EnumInitItem, IEnumItem, IEnumItemInit } from './IEnumItem';
import { IPackageContext } from '../contexts/IPackageContext';
import { IContextable } from '../contexts/IContextable';

export interface IEnumInit extends INamedItem, IPackagedItemInit {
  values: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  };
}

export interface IEnumStore extends INamedItem, IPackagedItemStore {
  values: Map<string, IEnumItem>;
}

export interface IEnumTransform {
  values: EnumItemTransformType;
}

export interface IEnum extends IModelType, IPackagedItem, IContextable<IPackageContext> {
  readonly modelType: 'enum';
  readonly values: Map<string, IEnumItem>;
}

export type EnumItemTransformType = {
  transform: (input: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  }) => Map<string, IEnumItem>;
  reverse: (input: Map<string, IEnumItem>) => IEnumItemInit[];
};
