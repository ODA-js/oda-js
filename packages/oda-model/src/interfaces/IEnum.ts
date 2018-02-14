import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import {EnumInitItem, IEnumItem } from './IEnumItem';

export interface IEnumInit extends INamedItem, IPackagedItemInit {
  values: EnumInitItem[] | {
    [name: string]: EnumInitItem;
  };
}

export interface IEnumStore extends INamedItem, IPackagedItemStore {
  values: Map<string, IEnumItem>;
}

export interface IEnumTransform {
  values: MapType<EnumInitItem[] | {
    [name: string]: EnumInitItem;
  }, Map<string, IEnumItem>>;
}

export interface IEnum extends IModelType, IPackagedItem {
  readonly modelType: 'enum';
  readonly values: Map<string, IEnumItem>;
}
