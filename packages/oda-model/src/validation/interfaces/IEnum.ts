import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import { INamedItem, IModelType } from './IModelType';
import { IPackagedItem, IPackagedItemStore, IPackagedItemInit } from './IPackagedItem';
import { IPackage } from './IPackage';


export interface IEnumInit extends INamedItem, IPackagedItemInit {
  values: IEnumItem[];
}

export interface IEnumStore extends INamedItem, IPackagedItemStore {
  values: Map<string, IEnumItem>;
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

