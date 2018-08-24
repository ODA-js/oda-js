import { Map } from 'immutable';

import { IContext } from '../contexts/IContext';
import { IContextable } from '../contexts/IContextable';
import { IEntityInit } from './IEntity';
import { IEnumInit } from './IEnum';
import { IModelType, INamedItem } from './IModelType';
import { IMutationInit } from './IMutation';
import { IPackage, IPackageInit } from './IPackage';

export interface IModelInit extends INamedItem {
  defaultPackageName: string;
  packages: IPackageInit[];
}

export interface IModelStore extends INamedItem {
  packages: Map<string, IPackage>;
}

export interface IModelTransform {
  packages: {
    transform: (inp: IPackageInit[], model: IModel) => Map<string, IPackage>;
    reverse: (inp: Map<string, IPackage>) => IPackageInit[];
  };
}

export interface IModel extends IModelType, IContextable<IContext> {
  readonly defaultPackage: IPackage;
  readonly modelType: 'model';
  readonly packages: Map<string, IPackage>;
}

export interface IModelLoad extends INamedItem {
  packages: IPackageInit[];
  entities: IEntityInit[];
  mutations: IMutationInit[];
  enums: IEnumInit[];
}
