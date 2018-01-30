import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import {INamedItem, IModelType} from './IModelType';
import { IPackagedItem } from './IPackagedItem';


export interface IEnumInit extends INamedItem {
  values: IEnumItem[];
}

export interface IEnumStore extends INamedItem {
  values: Map<string, IEnumItem>;
}

export interface IEnumItem extends IModelType {
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

