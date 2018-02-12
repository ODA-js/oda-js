import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import { IModelType, INamedItem } from './IModelType';
import { IPackage } from './IPackage';
import { IPackagedItem } from './IPackagedItem';

export interface IModelInit extends Partial<INamedItem>  {
  packages: IPackagedItem[];
}

export interface IModelStore extends INamedItem {
  packages: Map<string, IPackage>;
}

export interface IModelTransform {
  packages: ArrayToMap<IPackage>;
}

export interface IModel extends IModelType {
  readonly defaultPackage: IPackage;
  readonly modelType: 'model';
  readonly packages: Map<string, IPackage>;
}
