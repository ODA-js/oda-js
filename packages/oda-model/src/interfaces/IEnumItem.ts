import { Map } from 'immutable';

import { ArrayToMap, MapType } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { IEnum } from './IEnum';
import { IEnumContext } from '../contexts/IEnumContext';
import { IContextable } from '../contexts/IContextable';


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
