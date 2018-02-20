import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { IEnum } from './IEnum';
import { IEnumContext } from '../contexts/IEnumContext';


export type EnumInitItem = IEnumItemInit | string;

export interface IEnumItemInit extends INamedItem {
  value?: string;
  type?: string;
  context: IEnumContext;
}

export interface IEnumItem extends IModelType, Readonly<IEnumItemInit> {
  readonly value?: string;
  readonly type?: string;
  readonly context: IEnumContext;
}
