import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { IEnum } from './IEnum';


export type EnumInitItem = IEnumItemInit | string;

export interface IEnumItemInit extends INamedItem {
  value?: string;
  type?: string;
}

export interface IEnumItem extends IModelType, Readonly<IEnumItemInit> {
  readonly enum?: IEnum;
  readonly value?: string;
  readonly type?: string;
}
