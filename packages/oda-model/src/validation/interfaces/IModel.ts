import { IPackage } from './IPackage';
import { IModelType, INamedItem } from './IModelType';
import { Map } from 'immutable';
import { ArrayToMap } from '../model/utils';

export interface IModelInit extends Partial<INamedItem>  {
  packages: IPackage[];
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
}
