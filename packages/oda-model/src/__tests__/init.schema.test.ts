import schema from './../01_test_schema';
import { IEntityInit } from './../interfaces/IEntity';
import { IPackageInit } from './../interfaces/IPackage';
import { IMutationInit } from './../interfaces/IMutation';
import { INamedItem, IModelType } from '../interfaces/IModelType';
import { IEnumInit } from '../interfaces/IEnum';
import { Model } from '../model/Model';
import { Entity } from '../model/Entity';
import { Mutation } from '../model/Mutation';
import { Package } from '../model/Package';
import { Enum } from '../model/Enum';

export interface ModelLoad extends INamedItem {
  packages: IPackageInit[];
  entities: IEntityInit[];
  mutations: IMutationInit[];
  enums: IEnumInit[];
}

function LoadSchema(input: ModelLoad) {
  const systemPkg = new Package({
    items: [
      ...input.entities.map(e => new Entity(e)),
      ...input.mutations.map(m => new Mutation(m)),
      ...input.enums.map(m => new Enum(m)),
    ],
  });
  const result: IModelType = new Model({
    name: input.name,
    title: input.title,
    description: input.description,
    packages: [],
  });

  return systemPkg;
}

describe('Schemaloading', () => {
  let ld: IModelType;

  it('has atl least one package', () => {
    // ld.
  });

});





