import { Map } from 'immutable';

import { IModelType, INamedItem } from './IModelType';
import { IPackage, IPackageInit } from './IPackage';

export interface IModelInit extends INamedItem  {
  defaultPackageName: string;
  packages: IPackageInit[];
}

export interface IModelStore extends INamedItem {
  packages: Map<string, IPackage>;
}

export interface IModelTransform {
  packages: {
    transform: (inp: IPackageInit[]) => Map<string, IPackage>,
    reverse: (inp: Map<string, IPackage> ) => IPackageInit[],
  };
}

export interface IModel extends IModelType {
  readonly defaultPackage: IPackage;
  readonly modelType: 'model';
  readonly packages: Map<string, IPackage>;
}
