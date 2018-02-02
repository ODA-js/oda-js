import schema from './schema';
import { IEntityInit } from './../interfaces/IEntity';
import { IPackageInit } from './../interfaces/IPackage';
import { IMutationInit } from './../interfaces/IMutation';
import { INamedItem, IModelType } from '../interfaces/IModelType';
import { IEnumInit } from '../interfaces/IEnum';
import { Model } from '../model/Model';
import { Package } from '../model/Package';

export interface ModelLoad extends INamedItem {
  packages: IPackageInit[];
  entities: IEntityInit[];
  mutations: IMutationInit[];
  enums: IEnumInit[];
}

function LoadSchema(input: ModelLoad) {
  const systemPkg = new Package({});

  const result: IModelType = new Model({
    name: input.name,
    title: input.title,
    description: input.description,
    packages: [],
  });

  return result;
}



